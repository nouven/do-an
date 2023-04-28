import * as bigi from 'bigi';
import { Point } from 'ecurve';
import { SEPRCHAR } from 'src/constant';
import * as crypto from 'crypto';

function hexString2Hex(hexString: string) {
  // remove the leading 0x
  hexString = hexString.replace(/^0x/, '');
  // ensure even number of characters
  if (hexString.length % 2 != 0) {
    console.log(
      'WARNING: expecting an even number of characters in the hexString',
    );
  }
  // check for some non-hex characters
  const bad = hexString.match(/[G-Z\s]/i);
  if (bad) {
    console.log('WARNING: found non-hex characters', bad);
  }
  return Buffer.from(hexString, 'hex');
}

function buffer2HexString(buffer: Buffer) {
  return buffer.toString('hex');
}

export function bigis2Str(bigis: bigi[]) {
  let result = '';
  for (const i of bigis) {
    result = result.concat(`${i.toString(16)}${SEPRCHAR}`);
  }
  return result;
}
export function key2Json(curve: string, d: bigi, publ: Point) {
  return {
    priv: `${curve}${SEPRCHAR}${d.toString(16)}`,
    publ: `${curve}${SEPRCHAR}${bigis2Str([publ.x, publ.y, publ.z])}`,
  };
}

export function deKey(str: string) {
  const arr: any = str.split(SEPRCHAR);
  for (let i = 1; i < arr.length; i++) {
    arr[i] = bigi.fromHex(arr[i]);
  }
  return arr;
}

export function hash(buf: Buffer) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}
