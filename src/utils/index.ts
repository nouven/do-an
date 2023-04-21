function hexString2Hex(hexString: string) {
  // remove the leading 0x
  hexString = hexString.replace(/^0x/, '');
  // ensure even number of characters
  if (hexString.length % 2 != 0) {
    console.log(
      'WARNING: expecting an even number of characters in the hexString',
    );
  }
  // check for some non-hex characters
  const bad = hexString.match(/[G-Z\s]/i);
  if (bad) {
    console.log('WARNING: found non-hex characters', bad);
  }
  return Buffer.from(hexString, 'hex');
}

function buffer2HexString(buffer: Buffer) {
  return buffer.toString('hex');
}
