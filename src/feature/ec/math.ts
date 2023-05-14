import { BigInteger } from 'big-integer';
import { Point } from './point';
import * as bigInt from 'big-integer';

export const zero = bigInt(0);
export const one = bigInt(1);
export const two = bigInt(2);
export const three = bigInt(3);
export const four = bigInt(4);

export function modulo(x: BigInteger, n: BigInteger): BigInteger {
  let mod = x.divmod(n).remainder;
  if (mod.lesser(0)) {
    mod = mod.add(n);
  }
  return mod;
}

export function toJacobian(Q: Point) {
  return new Point(Q.x, Q.y, one);
}

export function fromJacobian(Q: Point, p: BigInteger): Point {
  const zinv = Q.z.modInv(p);
  //x = Qx/Qz^2
  const x = modulo(Q.x.multiply(zinv.pow(2)), p);
  //y = Qy/Qz^3
  const y = modulo(Q.y.multiply(zinv.pow(3)), p);
  return new Point(x, y);
}

export function jacobianDouble(P: Point, a: BigInteger, p: BigInteger): Point {
  if (P.y.eq(zero)) {
    return new Point(zero, zero, zero);
  }
  //Py^2
  const ysq = modulo(P.y.pow(two), p);
  //s = Px.4.y^2
  const s = modulo(P.x.multiply(four).multiply(ysq), p);
  //m = 3.Px^2 + a.Pz^4
  const m = modulo(
    P.x
      .pow(two)
      .multiply(three)
      .add(a.multiply(P.z.pow(four))),
    p,
  );
  //x = m^2 - 2s
  const x = modulo(m.pow(two).minus(s.multiply(two)), p);
  //y = m.(s - x) - 8.Py^4
  const y = modulo(m.multiply(s.minus(x)).minus(ysq.pow(two).multiply(8)), p);
  //z = 2.Py.Pz
  const z = modulo(P.y.multiply(P.z).multiply(two), p);

  return new Point(x, y, z);
}

export function jacobianAdd(
  P: Point,
  Q: Point,
  a: BigInteger,
  p: BigInteger,
): Point {
  if (P.y.eq(zero)) {
    return Q;
  }
  if (Q.y.eq(zero)) {
    return P;
  }
  //u1 = Px.Qz^2
  const u1 = modulo(P.x.multiply(Q.z.pow(two)), p);
  //u2 = Qx.Pz^2
  const u2 = modulo(Q.x.multiply(P.z.pow(two)), p);
  //s1 = Py.Qz^3
  const s1 = modulo(P.y.multiply(Q.z.pow(three)), p);
  //s2 = Qy.Pz^3
  const s2 = modulo(Q.y.multiply(P.z.pow(three)), p);

  if (u1.eq(u2)) {
    if (s1.neq(s2)) {
      return new Point(zero, zero, one);
    }
    return jacobianDouble(P, a, p);
  }
  //h = u2 - u1
  const h = u2.minus(u1);
  const h2 = modulo(h.multiply(h), p); // h^2
  const h3 = modulo(h.multiply(h2), p); // h^3
  const u1h2 = modulo(u1.multiply(h2), p);
  //r = s2 - s1
  const r = s2.minus(s1);
  //x = r^2 - h^3 - 2.u1.h^2
  const x = modulo(r.pow(two).minus(h3).minus(u1h2.multiply(two)), p);
  //y = r.(u1.h^2 - x) - s1.h^3
  const y = modulo(r.multiply(u1h2.minus(x)).minus(s1.multiply(h3)), p);
  //z = h.Qz.Pz
  const z = modulo(h.multiply(P.z).multiply(Q.z), p);

  return new Point(x, y, z);
}

export function jacobianMultiply(
  P: Point,
  d: BigInteger,
  n: BigInteger,
  a: BigInteger,
  p: BigInteger,
): Point {
  //d: scalar to multyply
  //n: order of the ec
  if (P.y.eq(zero) || d.eq(zero)) {
    return new Point(zero, zero, one);
  }
  if (d.eq(one)) {
    return P;
  }
  if (d.lesser(zero) || d.greaterOrEquals(n)) {
    return jacobianMultiply(P, modulo(d, n), n, a, p);
  }
  if (modulo(d, two).eq(zero)) {
    return jacobianDouble(jacobianMultiply(P, d.over(two), n, a, p), a, p);
  }
  if (modulo(d, two).eq(one)) {
    return jacobianAdd(
      jacobianDouble(jacobianMultiply(P, d.over(two), n, a, p), a, p),
      P,
      a,
      p,
    );
  }
  throw new Error('jacobian multiply error');
}

export function multiply(
  P: Point,
  d: BigInteger,
  n: BigInteger,
  a: BigInteger,
  p: BigInteger,
) {
  return fromJacobian(jacobianMultiply(toJacobian(P), d, n, a, p), p);
}

export function add(P: Point, Q: Point, a: BigInteger, p: BigInteger): Point {
  return fromJacobian(jacobianAdd(toJacobian(P), toJacobian(Q), a, p), p);
}
