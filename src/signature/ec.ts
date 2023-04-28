import * as bigi from 'bigi';
import { Curve, Point } from 'ecurve';
import * as crypto from 'crypto';
import { p256, secp256k1 } from 'src/utils/curves';

interface IPoint {
  x: bigi;
  y: bigi;
  z: bigi;
}
export class EC {
  private curve!: Curve;
  public name: string;
  constructor(curve: string) {
    this.name = curve;
    this.init(curve);
  }
  init(curve: string) {
    let p, a, b, Gx, Gy, n, h: bigi;
    switch (curve) {
      case 'p256':
        p = bigi.fromHex(p256.p);
        a = bigi.fromHex(p256.a);
        b = bigi.fromHex(p256.b);
        Gx = bigi.fromHex(p256.G[0]);
        Gy = bigi.fromHex(p256.G[1]);
        n = bigi.fromHex(p256.n);
        h = bigi.fromHex(p256.h);
        this.curve = new Curve(p, a, b, Gx, Gy, n, h);
        break;
      default:
        p = bigi.fromHex(secp256k1.p);
        a = bigi.fromHex(secp256k1.a);
        b = bigi.fromHex(secp256k1.b);
        Gx = bigi.fromHex(secp256k1.G[0]);
        Gy = bigi.fromHex(secp256k1.G[1]);
        n = bigi.fromHex(secp256k1.n);
        h = bigi.fromHex(secp256k1.h);
        this.curve = new Curve(p, a, b, Gx, Gy, n, h);
        break;
    }
  }

  public generateKey() {
    const randNum = crypto.randomBytes(12);
    const d = bigi.fromBuffer(randNum);
    return {
      priv: d,
      publ: this.curve.G.multiply(d),
    };
  }

  public sign(m: bigi, priv: bigi) {
    const randNum = crypto.randomBytes(12);
    const k = bigi.fromBuffer(randNum);
    const kG = this.curve.G.multiply(k);
    const r = kG.affineX;
    const kinvm = k.modInverse(this.curve.n);

    const s = kinvm.multiply(m.add(r.multiply(priv))).mod(this.curve.n);

    const kGx = kG.affineX.toString(16);
    const kGy = kG.affineY.toString(16);
    return {
      r: kG.affineX,
      s: s,
    };
  }

  public verify(m: bigi, r: bigi, s: bigi, publ: Point) {
    const sinvm = s.modInverse(this.curve.n);

    const u1 = m.multiply(sinvm).mod(this.curve.n);
    const u2 = r.multiply(sinvm).mod(this.curve.n);

    const V = this.curve.G.multiplyTwo(u1, publ, u2);

    const Vx = V.affineX;
    const Vy = V.affineY;
    return Vx.equals(r);
  }
}
//const m = bigi.fromHex('aabbccddee');
//const ec = new EC('secp256k1');
//const key = ec.generateKey();
//const signature = ec.sign(m, key.priv);
//const isValid = ec.verify(m, signature.r, signature.s, key.publ);
