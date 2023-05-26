export enum SignEnum {
  STAND_EC = 1,
  ENHANDCED_EC = 2,
}

export enum cryptoTypeEnum {
  EC = 'EC',
  RSA = 'RSA',
}

export enum actionEnum {
  SIGN = 'SIGN',
  GENERATE_KEY = 'GENERATE_KEY',
  VERIFY = 'VERIFY',
}
export enum verificationResultEnum {
  MESSAGE_IS_CHANGED = 1,
  PUBLIC_KEY_IS_CHANGED = 2,
  SIGNATURE_IS_VALID = 3,
}

export const cryptoTypes = [cryptoTypeEnum.EC, cryptoTypeEnum.RSA];

export const SEPR_CHAR = '##';

export const AES_ALGORITHM = 'aes-256-ctr';

export const SIGNTURE_SIZE = 1024;
