import { BigInteger } from 'big-integer';
import * as bigInt from 'big-integer';
import {
  cryptoTypeEnum,
  SEPR_CHAR,
  verificationResultEnum,
} from 'src/constant';

export class RSA {
  private e: BigInteger;
  private d!: BigInteger;
  private n!: BigInteger;
  constructor() {
    this.e = bigInt(65537);
  }

  public getPrivKey() {
    //type-d-n
    return `${cryptoTypeEnum.RSA}${SEPR_CHAR}${this.d.toString(
      16,
    )}${SEPR_CHAR}${this.n?.toString(16)}`;
  }

  public setPrivKey(key: string) {
    const [type, d, n] = key.split(SEPR_CHAR);
    this.d = bigInt(d, 16);
    this.n = bigInt(n, 16);
  }

  public setKey(priv: string, publ: string) {
    this.setPrivKey(priv);
    this.setPublKey(publ);
  }

  public getPublKey() {
    //type-e-n
    return `${cryptoTypeEnum.RSA}${SEPR_CHAR}${this.e.toString(
      16,
    )}${SEPR_CHAR}${this.n?.toString(16)}`;
  }

  public setPublKey(key: string) {
    const [type, e, n] = key.split(SEPR_CHAR);
    this.e = bigInt(e, 16);
    this.n = bigInt(n, 16);
  }

  private randomPrime(bitNum: number) {
    const min = bigInt.one.shiftLeft(bitNum - 1);
    const max = bigInt.one.shiftLeft(bitNum).prev();

    while (true) {
      let p = bigInt.randBetween(min, max);
      if (p.isProbablePrime(256)) {
        return p;
      }
    }
  }

  public generateKey(bitNum: number) {
    let p;
    let q;
    let phi;
    do {
      p = this.randomPrime(bitNum / 2);
      q = this.randomPrime(bitNum / 2);
      phi = bigInt.lcm(p.prev(), q.prev());
    } while (
      bigInt.gcd(this.e, phi).notEquals(1) ||
      p
        .minus(q)
        .abs()
        .shiftRight(bitNum / 2 - 100)
        .isZero()
    );
    this.n = p.multiply(q);
    this.d = this.e.modInv(phi);
  }

  public sign(hashedMsg: string): string {
    const m = bigInt(hashedMsg, 16);
    const s = m.modPow(this.d, this.n);
    //type-hashedMsg-s-e-n
    return `${
      cryptoTypeEnum.RSA
    }${SEPR_CHAR}${hashedMsg}${SEPR_CHAR}${s.toString(
      16,
    )}${SEPR_CHAR}${this.e.toString(16)}${SEPR_CHAR}${this.n.toString(16)}`;
  }
  public verify(signatrue: string, hashedMsg, key?: string) {
    let [type, prevHashedMsg, s, e, n] = signatrue.split(SEPR_CHAR);
    this.e = bigInt(e, 16);
    this.n = bigInt(n, 16);
    if (key) {
      this.setPublKey(key);
    }
    const prem = bigInt(prevHashedMsg, 16);
    const m = bigInt(hashedMsg, 16);

    if (prem.neq(m)) {
      return verificationResultEnum.MESSAGE_IS_CHANGED;
    }

    const v = bigInt(s, 16).modPow(this.e, this.n);

    console.log('<=========> m: ', m.toString(16));
    console.log('<=========> : s^e mod n:', v.toString(16));

    if (v.eq(m)) {
      return verificationResultEnum.SIGNATURE_IS_VALID;
    } else {
      return verificationResultEnum.PUBLIC_KEY_IS_CHANGED;
    }
  }
}
