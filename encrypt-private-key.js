#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 * @purpose Encrypt private keys before storing in database.
 */

'use strict'

const keyUtil = require('./key-util')

// const crypto = require('browserify-aes')
const crypto = require('crypto')

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    const privateKey = process.argv[i]
    if (!privateKey.startsWith('PVT_K1_')) {
      privateKey = keyUtil.convertLegacyPrivateKey(privateKey)
    }
    console.log(privateKey, encryptKey(privateKey))
  }
} else {
  const privateKey = keyUtil.convertLegacyPrivateKey(keyUtil.EXAMPLE_PRIVATE_KEY)
  console.log(privateKey, encryptKey(privateKey))
}

function encryptKey(privateKey) {
  const { prefix, type, payload } = keyUtil.stringToKey(privateKey)
  // use XOR for test, this is unsafe!
  // for (let i = 0; i < payload.length; ++i) {
  //   payload[i] ^= 0x5a
  // }
  // return keyUtil.keyToString(prefix, type, payload)
  const key = Buffer.from(
    '66fc6351d1bbbe8aa2a8713b24427d18460b77f235e508130ada9382e8caf2f0', 'hex')
  const iv = Buffer.from('26a45f18202b10a35ca3c4897cae5adc', 'hex')
  const aes = crypto.createCipheriv('aes-256-ctr', key, iv)
  const cipher = aes.update(payload)
  aes.final()
  return keyUtil.keyToString(prefix, type, cipher)
}
