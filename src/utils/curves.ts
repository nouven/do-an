export const p256 = {
  type: 'short',
  prime: null,
  p: 'ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
  a: 'ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
  b: '5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
  n: 'ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
  h: '01',
  gRed: false,
  G: [
    '6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296',
    '4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
  ],
};

export const secp256k1 = {
  type: 'short',
  prime: 'k256',
  p: 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f',
  a: '00',
  b: '07',
  n: 'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
  h: '01',
  // Precomputed endomorphism
  beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
  lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
  basis: [
    {
      a: '3086d221a7d46bcde86c90e49284eb15',
      b: '-e4437ed6010e88286f547fa90abfe4c3',
    },
    {
      a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
      b: '3086d221a7d46bcde86c90e49284eb15',
    },
  ],

  gRed: false,
  G: [
    '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
  ],
};

const curveMap = new Map();
curveMap.set('p256', p256);
curveMap.set('secp256k1', secp256k1);
