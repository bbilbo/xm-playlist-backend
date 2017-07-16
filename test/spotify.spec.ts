import { searchTrack } from '../src/spotify';
import { setup } from '../models/dbinit';

beforeAll(async function(done) {
  await setup(true);
  done();
});

describe('spotify', function() {
  it('should find Say My Name', async function() {
    const name = 'Say My Name (Remix)';
    const artists = ['ODESZA', 'Cedric Gervais', 'Zyra'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('1gNj8JoisgQZQmrcpfx9E5');
  });
  it('should find Cold Water', async function() {
    const name = 'Cold Water-Lost Frequencies Remix';
    const artists = ['Justin Bieber', 'Major Lazer', 'MO'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('4HMfSzk0UsiRhulF0eb1M9');
  });
  it('should find Feel Your Love', async function() {
    const name = 'Feel Your Love';
    const artists = ['Flux Pavillion', 'NGHTMRE'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('0YzwCpQVGtg4P2oFAC95bm');
  });
  it('should find The Right Song', async function() {
    const name = 'The Right Song';
    const artists = ['Tiesto', 'Oliver Heldens', 'Natalie LaRos'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('6Jao8qdCB3VYG4PhPzCEIm');
  });
  it('should find False Alarm-Hook N Sling Mix', async function() {
    const name = 'False Alarm-Hook N Sling Mix';
    const artists = ['Matoma'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('7FWSYDL3TOu0Q4fzBdx3F5');
  });
  it('should find Closer (R3HAB Mix)', async function() {
    const name = 'Closer (R3HAB Mix)';
    const artists = ['The Chainsmokers', 'Halsey'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('0Ye1olMyvB2rLjZ4vlYVWI');
  });
  it('should find Falling', async function() {
    const name = 'Falling';
    const artists = ['Alesso'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('43mNwDn0zOH2HKl5B4aqcx');
  });
  it('should find Rush Over Me FT', async function() {
    const name = 'Rush Over Me (ft. HALIENE)';
    const artists = ['Illenium', 'SevenLions', 'SaidTheSky'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('2z50GlkP7GinGZauNHwD7j');
  });
  it('should find Another Life', async function() {
    const name = 'Another Life (f.Ester Dean)';
    const artists = ['David Guetta', 'Afrojack'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('0AOEd0Zw22aTE8LzsS4EMg');
  });
  it('should find Subeme La Radio-Ravell Remix', async function() {
    const name = 'Subeme La Radio-Ravell Remix';
    const artists = ['Enrique Iglesias', 'Descemer Bueno', 'Zio'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('1eJaMOi47bQlinXC9wi5b3');
  });
  it('should find Something Just Like This-Alesso Rem', async function() {
    const name = 'Something Just Like This-Alesso Rem';
    const artists = ['The Chainsmokers', 'Coldplay'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('50RJdoxw8iajGNtHQe6QeS');
  });
  it('should find Jumpin\' Jumpin\'', async function() {
    const name = 'Jumpin\' Jumpin\' (00)';
    const artists = ['Destiny\'s Child'];
    const res = await searchTrack(artists, name);
    expect(res.spotifyId).toBe('4pmc2AxSEq6g7hPVlJCPyP');
  });
});
