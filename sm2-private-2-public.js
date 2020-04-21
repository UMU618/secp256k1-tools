#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const keyUtil = require('./key-util')

function legacyPrivateKeyToPublicKey(privateKey) {
  const payload = keyUtil.stringToLegacyPrivateKey(privateKey)
  return keyUtil.legacyPublicKeyToString('EOS'
    , keyUtil.getPointFromEcc(payload, 'sm2'))
}

function privateKeyToPublicKey(privateKey) {
  const { type, payload } = keyUtil.stringToKey(privateKey)
  return keyUtil.keyToString('PUB', type
    , keyUtil.getPointFromEcc(payload, 'sm2'))
}

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    const privateKey = process.argv[i]
    if (privateKey.startsWith('PVT_SM2_')) {
      const publicKey = privateKeyToPublicKey(privateKey)

      console.log(privateKey)
      console.log(publicKey)
    } else {
      const publicKey = legacyPrivateKeyToPublicKey(privateKey)

      console.log(keyUtil.convertLegacyPrivateKey(privateKey), privateKey)
      console.log(keyUtil.convertLegacyPublicKey(publicKey), publicKey)
    }
  }
} else {
  const privateKey = keyUtil.EXAMPLE_PRIVATE_KEY
  const publicKey = legacyPrivateKeyToPublicKey(privateKey)
  console.log(keyUtil.convertLegacyPrivateKey(privateKey), privateKey)
  console.log(keyUtil.convertLegacyPublicKey(publicKey), publicKey)
}
