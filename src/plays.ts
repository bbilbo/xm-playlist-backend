import { Op, col, fn } from 'sequelize';
import * as _ from 'lodash';
import { subDays, format } from 'date-fns';

import {
  Play,
  PlayAttributes,
  PlayInstance,
  Track,
  Artist,
  sequelize as s,
  Spotify,
} from '../models';
import { Channel } from './channels';

export async function getLast(channel: Channel): Promise<any> {
  return await Play.findOne({
    where: { channel: channel.number },
    order: [['startTime', 'DESC']],
    include: [{ model: Track }],
  });
}

export async function getRecent(channel: Channel, last?: Date) {
  const where: any = { channel: channel.number };
  if (last) {
    where.startTime = { [Op.lt]: last };
  }
  return await Play.findAll({
    where,
    order: [['startTime', 'DESC']],
    include: [
      { model: Track, include: [{ model: Artist }, { model: Spotify }] },
    ],
    limit: 20,
  });
}

export async function popular(channel: Channel, limit = 50) {
  const thirtyDays = subDays(new Date(), 30);
  let lastThirty: any = await Play.findAll({
    where: {
      channel: channel.number,
      startTime: { [Op.gt]: thirtyDays },
    },
    attributes: [
      fn('DISTINCT', col('trackId')),
      'trackId',
      [fn('COUNT', col('trackId')), 'count'],
    ],
    group: [['trackId']],
  }).then((t) => t.map((n) => n.toJSON()));
  lastThirty = lastThirty
    .filter((n: any) => n.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  const ids = lastThirty.map((n) => n.trackId);
  const keyed: any = _.keyBy(lastThirty, _.identity('trackId'));
  const tracks = await Track.findAll({
    where: {
      id: { [Op.in]: ids },
    },
    include: [Artist, Spotify],
  }).then((t) =>
    t.map((n) => {
      const res: any = n.toJSON();
      res.count = keyed[res.id].count;
      return res;
    }),
  );
  return tracks.sort((a, b) => b.count - a.count);
}
