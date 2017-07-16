import * as _ from 'lodash';

export function encode(unencoded: string) {
  return new Buffer(unencoded || '')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decode(encoded: string) {
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (encoded.length % 4) {
    encoded += '=';
  }
  return new Buffer(encoded || '', 'base64').toString('utf8');
}

/* remove ft feat */
export function cleanFt(str: string) {
  return str.replace('f.', '').replace(/(f|w)((eat.|t|eat)|(\.|\/))\b/i, ' ');
}

/* remove OFFICAL MUSIC VIDEO */
export function cleanMusicVideo(str: string) {
  return str
    .replace(/\(Official\)/i, '')
    .replace(/\[Official\]/i, '')
    .replace(/(official|music).+(video)/i, '');
}

export function cleanSpaces(str: string) {
  return str.replace(/  +/g, ' ');
}

export function cleanRemix(str: string) {
  return str.replace(/(remix|mix|edit)\b/i, '');
}

export function cleanYear(str: string) {
  return str.replace(/\((\'?)[0-9]+\)/, '');
}

export function cleanCutoff(str: string) {
  if (str.length === 35) {
    return str.replace(/\s(\w+)$/, '');
  }
  return str;
}

export function noKarayoke(str: string) {
  return str.replace(/\([0-9]+\)/, '');
}

export function cleanupExtra(str: string) {
  const cleanStr = str
    .replace('-', ' ')
    .replace('.', '')
    .replace('(', ' ')
    .replace(')', ' ')
    .replace('\'', '')
    .replace('!', ' ');
  const words = cleanStr.split(' ').filter((n) => n.length > 1);
  return words.join(' ');
}
