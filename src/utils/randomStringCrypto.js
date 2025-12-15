function randomStringCrypto(length = 8) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).slice(-2)).join(
    ""
  );
}

export default randomStringCrypto;
