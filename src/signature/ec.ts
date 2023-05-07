import * as bigi from 'bigi';
import { Curve, Point } from 'ecurve';
import * as ecurve from 'ecurve';
import * as crypto from 'crypto';
import { p256, secp256k1 } from 'src/utils/curves';
import { cryptoTypeEnum, SEPR_CHAR } from 'src/constant';
import { str2Bigi } from 'src/utils';

interface IPoint {
  x: bigi;
  y: bigi;
  z: bigi;
}
export class EC {
  private curve!: Curve;
  public name: string;
  private priv: bigi;
  private publ: Point;
  constructor() {
    this.init();
  }
  init() {
    this.curve = ecurve.getCurveByName('secp256k1');
    this.name = 'secp256k1';
  }

  public generateKey() {
    const randNum = crypto.randomBytes(12);
    const d = bigi.fromBuffer(randNum);
    this.priv = d;
    this.publ = this.curve.G.multiply(d);
  }

  public getPrivateKey() {
    //type-d
    return `${cryptoTypeEnum.EC}${SEPR_CHAR}${this.priv.toString(16)}`;
  }

  public setPrivateKey(privKey: string) {
    let [type, priv] = privKey.split(SEPR_CHAR);
    this.priv = str2Bigi(priv);
  }

  public getPublicKey() {
    //type-x-y-z
    return `${cryptoTypeEnum.EC}${SEPR_CHAR}${this.publ.x.toString(
      16,
    )}${SEPR_CHAR}${this.publ.y.toString(16)}${SEPR_CHAR}${this.publ.z.toString(
      16,
    )}`;
  }

  public setKey(priv: string, publ: string) {
    this.setPrivateKey(priv);
    this.setPublicKey(publ);
  }

  public setPublicKey(publKey: string) {
    const [type, x, y, z] = publKey.split(SEPR_CHAR);
    const Px = str2Bigi(x);
    const Py = str2Bigi(y);
    const Pz = str2Bigi(z);
    this.publ = new Point(this.curve, Px, Py, Pz);
  }

  public getCurve() {
    return this.curve;
  }

  public sign(msg: string) {
    const m = str2Bigi(msg);
    const randNum = crypto.randomBytes(12);
    const k = bigi.fromBuffer(randNum);
    const kG = this.curve.G.multiply(k);
    const r = kG.affineX;
    const kinvm = k.modInverse(this.curve.n);

    const s = kinvm.multiply(m.add(r.multiply(this.priv))).mod(this.curve.n);

    const kGx = kG.affineX.toString(16);
    const kGy = kG.affineY.toString(16);

    //type-m-r-s-Px-Py-Pz
    return `${cryptoTypeEnum.EC}${SEPR_CHAR}${msg}${SEPR_CHAR}${r.toString(
      16,
    )}${SEPR_CHAR}${s.toString(16)}${SEPR_CHAR}${this.publ.x.toString(
      16,
    )}${SEPR_CHAR}${this.publ.y.toString(16)}${SEPR_CHAR}${this.publ.z.toString(
      16,
    )}`;
  }

  public verify(signature: string, hashedMsg: string) {
    const [e1, prevHashedMsg, e3, e4, e5, e6, e7] = signature.split(SEPR_CHAR);
    const m = str2Bigi(hashedMsg);
    const r = str2Bigi(e3);
    const s = str2Bigi(e4);

    const Px = str2Bigi(e5);
    const Py = str2Bigi(e6);
    const Pz = str2Bigi(e7);

    this.publ = new Point(this.curve, Px, Py, Pz);

    const sinvm = s.modInverse(this.curve.n);
    const u1 = m.multiply(sinvm).mod(this.curve.n);
    const u2 = r.multiply(sinvm).mod(this.curve.n);

    const V = this.curve.G.multiplyTwo(u1, this.publ, u2);

    const Vx = V.affineX;
    const Vy = V.affineY;
    return Vx.equals(r);
  }
}
