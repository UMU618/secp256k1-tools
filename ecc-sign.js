#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2018
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const keyUtil = require('./key-util')

const bsc = require('bs58check')
const hash = require('hash.js')
const EC = require('elliptic').ec

const data = Buffer.from(
  // chainId
  'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
  // serializedTransaction
  + 'c0fbc75d000000000000000000000000'
  // sha256 of serializedContextFreeData
  + '0000000000000000000000000000000000000000000000000000000000000000', 'hex')

const digest = hash.sha256().update(data).digest()
console.log(digest)

const k1 = new EC('secp256k1')
const key = k1.keyFromPrivate(
  keyUtil.stringToLegacyPrivateKey(keyUtil.EXAMPLE_PRIVATE_KEY))
const isCanonical = (n) => {
  // MUST be in range [0x0080..00, 0x7fff..ff]
  return !(n[0] & 0x80) && !(n[0] === 0 && !(n[1] & 0x80))
}
let sigData
let tries = 0
for (;;) {
  const sig = key.sign(digest, {canonical: true, pers: [++tries]})
  //console.log(sig.toDER())
  const r = sig.r.toArray()
  const s = sig.s.toArray()
  if (!isCanonical(r) || !isCanonical(s)) {
    continue
  }
  sigData = new Uint8Array([sig.recoveryParam + 27].concat(r, s));
  break
}

console.log(sigData)
console.log(keyUtil.keyToString('SIG', 'K1', sigData))
