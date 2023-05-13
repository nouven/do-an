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
}

export const cryptoTypes = [cryptoTypeEnum.EC, cryptoTypeEnum.RSA];

export const SEPR_CHAR = '##';

export const AES_ALGORITHM = 'aes-256-ctr';

export const SIGNTURE_SIZE = 1024;
