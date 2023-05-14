import { BigInteger } from 'big-integer';
import { zero } from './math';

export class Point {
  x: BigInteger;
  y: BigInteger;
  z: BigInteger;
  constructor(x = zero, y = zero, z = zero) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
