import { BigInteger } from 'big-integer';
import { Curve } from './curve';
import { Point } from './point';
import { add, modulo, multiply } from './math';
import { Buffer } from 'buffer';
import { randomBytes } from 'crypto';
import {
  cryptoTypeEnum,
  SEPR_CHAR,
  verificationResultEnum,
} from 'src/constant';
import * as bigInt from 'big-integer';

export class EC {
  private curve: Curve;
  private priv: BigInteger;
  private publ: Point;
  constructor(curve?: string) {
    this.curve = new Curve();
  }
  public generateKey() {
    const randNum = Buffer.from(randomBytes(20)).toString('hex');
    const d = bigInt(randNum, 16);
    this.priv = d;
    this.publ = multiply(
      this.curve.G,
      d,
      this.curve.n,
      this.curve.a,
      this.curve.p,
    );
  }
  public sign(msg: string) {
    const m = bigInt(msg, 16);
    const k = bigInt(Buffer.from(randomBytes(20)).toString('hex'), 16);
    const kG = multiply(
      this.curve.G,
      k,
      this.curve.n,
      this.curve.a,
      this.curve.p,
    );
    const r = modulo(kG.x, this.curve.n);
    const kinv = k.modInv(this.curve.n);
    const s = modulo(kinv.multiply(m.add(r.multiply(this.priv))), this.curve.n);
    return this.makeSignature(msg, r, s);
  }

  public verify(signature: string, hashedMsg: string, key?: string) {
    let { preHashedMsg, r, s, Px, Py } = this.breakSignature(signature);
    const m = bigInt(hashedMsg, 16);
    if (m.neq(preHashedMsg)) {
      return verificationResultEnum.MESSAGE_IS_CHANGED;
    }
    this.publ = new Point(Px, Py);
    if (key) {
      this.setPublicKey(key);
    }

    const sinv = s.modInv(this.curve.n);
    const u1 = modulo(m.multiply(sinv), this.curve.n);
    const u2 = modulo(r.multiply(sinv), this.curve.n);
    const R1 = multiply(
      this.curve.G,
      u1,
      this.curve.n,
      this.curve.a,
      this.curve.p,
    );
    const R2 = multiply(
      this.publ,
      u2,
      this.curve.n,
      this.curve.a,
      this.curve.p,
    );
    const R = add(R1, R2, this.curve.a, this.curve.p);

    if (r.eq(R.x)) {
      return verificationResultEnum.SIGNATURE_IS_VALID;
    } else {
      return verificationResultEnum.PUBLIC_KEY_IS_CHANGED;
    }
  }

  public setPrivateKey(privKey: string) {
    const [type, priv] = privKey.split(SEPR_CHAR);
    try {
      this.priv = bigInt(priv, 16);
    } catch (error) {
      console.log('<============>   ', error);
    }
  }
  public setPublicKey(publKey: string) {
    const [type, Px, Py] = publKey.split(SEPR_CHAR);
    try {
      const x = bigInt(Px, 16);
      const y = bigInt(Py, 16);
      this.publ = new Point(x, y);
    } catch (error) {
      console.log('<============>   ', error);
    }
  }

  public setKey(priv: string, publ: string) {
    this.setPrivateKey(priv);
    this.setPublicKey(publ);
  }

  public getPrivKey(): string {
    //type-d
    return `${cryptoTypeEnum.EC}${SEPR_CHAR}${this.priv.toString(16)}`;
  }
  public getPublKey(): string {
    //type-x-y
    return `${cryptoTypeEnum.EC}${SEPR_CHAR}${this.publ.x.toString(
      16,
    )}${SEPR_CHAR}${this.publ.y.toString(16)}`;
    return;
  }

  private makeSignature(msg: string, r: BigInteger, s: BigInteger): string {
    //type-m-r-s-Px-Py
    return `${cryptoTypeEnum.EC}${SEPR_CHAR}${msg}${SEPR_CHAR}${r.toString(
      16,
    )}${SEPR_CHAR}${s.toString(16)}${SEPR_CHAR}${this.publ.x.toString(
      16,
    )}${SEPR_CHAR}${this.publ.y.toString(16)}`;
    return;
  }
  private breakSignature(signature: string) {
    const [type, m, r, s, Px, Py] = signature.split(SEPR_CHAR);
    return {
      preHashedMsg: bigInt(m, 16),
      r: bigInt(r, 16),
      s: bigInt(s, 16),
      Px: bigInt(Px, 16),
      Py: bigInt(Py, 16),
    };
  }
}
