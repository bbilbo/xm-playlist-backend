import * as debug from 'debug';
import * as request from 'request-promise-native';
import * as _ from 'lodash';
import { format as dateFmt, differenceInDays } from 'date-fns';

import { findOrCreateArtists } from './tracks';
import { getLast } from './plays';
import {
  Track,
  ArtistTrack,
  Play,
  ArtistTrackInstance,
  Artist,
  TrackAttributes,
  Spotify,
} from '../models';
import { channels, Channel } from './channels';
import { encode } from './util';
import { spotifyFindAndCache, searchTrack, matchSpotify } from './spotify';

// https://www.siriusxm.com/metadata/pdt/en-us/json/channels/thebeat/timestamp/02-25-08:10:00
const baseurl = 'https://www.siriusxm.com';
const log = debug('xmplaylist');

export function parseArtists(artists: string): string[] {
  // splits artists into an array
  return artists.match(/(?:\/\\|[^/\\])+/g);
}
export function parseName(name: string) {
  return name.split(' #')[0];
}

export function parseChannelMetadataResponse(meta: any, currentEvent: any) {
  const artists = parseArtists(String(currentEvent.artists.name));
  const name = parseName(String(currentEvent.song.name));
  const songId = String(currentEvent.song.id);
  return {
    channelId: meta.channelId,
    channelName: meta.channelName,
    channelNumber: meta.channelNumber,
    name,
    artists,
    artistsId: currentEvent.artists.id,
    startTime: new Date(currentEvent.startTime),
    songId: songId.replace(/#/g, '!'),
  };
}

export async function checkEndpoint(channel: Channel) {
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const dateString = dateFmt(utc, 'MM-DD-HH:mm:00');
  const url = `${baseurl}/metadata/pdt/en-us/json/channels/${channel.id}/timestamp/${dateString}`;
  log(url);
  let res;
  try {
    res = await request.get(url, { json: true, gzip: true, simple: true });
  } catch (e) {
    return false;
  }
  if (!res.channelMetadataResponse || !res.channelMetadataResponse.status) {
    return false;
  }
  const meta = res.channelMetadataResponse.metaData;
  const currentEvent = meta.currentEvent;
  if (
    !currentEvent.song ||
    !currentEvent.song.id ||
    !currentEvent.artists ||
    !currentEvent.artists.id ||
    !currentEvent.artists.name ||
    !currentEvent.song.name
  ) {
    return false;
  }

  const newSong = parseChannelMetadataResponse(meta, currentEvent);
  if (['^I', ''].includes(newSong.songId) || newSong.name[0] === '#') {
    return false;
  }
  const last = await getLast(channel);
  newSong.songId = encode(newSong.songId);
  if (last && last.track.songId === newSong.songId) {
    return false;
  }
  const track = await insertPlay(newSong, channel);
  // TODO: announce
  log(newSong);

  if (process.env.NODE_ENV !== 'test') {
    spotifyFindAndCache(track)
      .then(async (doc) => {
        log('DAYS', differenceInDays(new Date(), doc.get('createdAt')));
        if (differenceInDays(new Date(), doc.get('createdAt')) > 7) {
          return matchSpotify(track, true);
        }
        return doc;
      })
      .catch((err) => log('spotifyFindAndCacheError', err));
  }
  return true;
}

export async function insertPlay(data: any, channel: Channel): Promise<TrackAttributes> {
  const artists = await findOrCreateArtists(data.artists);
  let track = await Track.findOne({ where: { songId: data.songId } });
  if (track) {
    track.increment('plays');
  } else {
    track = await Track.create({
      songId: data.songId,
      name: data.name,
    });
    const at = artists.map((artist) => {
      return {
        artistId: artist.get('id'),
        trackId: track.get('id'),
      };
    });
    await ArtistTrack.bulkCreate(at, { returning: false });
  }
  await Play.create(
    { channel: channel.number, trackId: track.get('id'), startTime: new Date(data.startTime) },
    { returning: false },
  );
  const final = await Track.findById(track.get('id'), { include: [Artist, Spotify]});
  return final.toJSON();
}
