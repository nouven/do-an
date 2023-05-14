import { BigInteger } from 'big-integer';
import { Point } from './point';
import * as bigInt from 'big-integer';

const secp256k1 = {
  p: 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f',
  a: '00',
  b: '07',
  n: 'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
  Gx: '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
  Gy: '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
};
export class Curve {
  a: BigInteger;
  b: BigInteger;
  p: BigInteger;
  n: BigInteger;
  G: Point;
  constructor(curve?: string) {
    this.init(curve);
  }
  init(curve?: string) {
    this.a = bigInt(secp256k1.a, 16);
    this.b = bigInt(secp256k1.b, 16);
    this.p = bigInt(secp256k1.p, 16);
    this.n = bigInt(secp256k1.n, 16);
    const Gx = bigInt(secp256k1.Gx, 16);
    const Gy = bigInt(secp256k1.Gy, 16);
    this.G = new Point(Gx, Gy);
  }
}
