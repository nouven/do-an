import * as bigi from 'bigi';
import { Point } from 'ecurve';
import { SEPR_CHAR } from 'src/constant';
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
    result = result.concat(`${i.toString(16)}${SEPR_CHAR}`);
  }
  return result;
}
export function key2Json(curve: string, d: bigi, publ: Point) {
  return {
    priv: `${curve}${SEPR_CHAR}${d.toString(16)}`,
    publ: `${curve}${SEPR_CHAR}${bigis2Str([publ.x, publ.y, publ.z])}`,
  };
}

export function str2arr(str: string) {
  const arr: any = str.split(SEPR_CHAR);
  for (let i = 1; i < arr.length; i++) {
    arr[i] = bigi.fromHex(arr[i]);
  }
  return arr;
}

export function sign2Str(curve: string, bigis: bigi[]) {
  let result = `${curve}${SEPR_CHAR}`;
  for (const i of bigis) {
    result = result.concat(i.toString(16), SEPR_CHAR);
  }
  return result;
}

export function hash(buf: Buffer) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

export function str2Bigi(str: string): bigi {
  let temp = '';
  if (str.length % 2 === 1) {
    temp = `0${str}`;
  } else {
    temp = str;
  }
  return bigi.fromHex(temp);
}

export function removePad(buffer: Buffer): Buffer {
  let i = buffer.length - 1;
  while (i >= 0 && buffer[i] === 0) {
    i--;
  }
  return buffer.slice(0, i + 1);
}
