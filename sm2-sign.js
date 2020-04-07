#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2018
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const keyUtil = require('./key-util')

//const bsc = require('bs58check')
//const hash = require('hash.js')
const sm3 = require('sm3.js').sm3
const { ec, curves } = require('elliptic')
const debug = require('debug')('secp256k1-tools:sm2-sign')

const digest = sm3().update('UMU').digest()
console.log(digest)
debug('h =', Buffer.from(digest).toString('hex'))

const curve = new ec(new curves.PresetCurve({
  type: 'short'
  , prime: null
  , p: 'fffffffe ffffffff ffffffff ffffffff ffffffff 00000000 ffffffff ffffffff'
  , a: 'fffffffe ffffffff ffffffff ffffffff ffffffff 00000000 ffffffff fffffffc'
  , b: '28e9fa9e 9d9f5e34 4d5a9e4b cf6509a7 f39789f5 15ab8f92 ddbcbd41 4d940e93'
  , n: 'fffffffe ffffffff ffffffff ffffffff 7203df6b 21c6052b 53bbf409 39d54123'
  , hash: sm3
  , gRed: false
  , g: [
    '32c4ae2c1f1981195f9904466a39c9948fe30bbff2660be1715a4589334c74c7',
    'bc3736a2f4f6779c59bdcee36b692153d0a9877cc62a474002df32e52139f0a0'
  ]
}))
const key = curve.keyFromPrivate(
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
  debug('r =', Buffer.from(r).toString('hex'))
  debug('s =', Buffer.from(s).toString('hex'))
  sigData = new Uint8Array([sig.recoveryParam + 27].concat(r, s));
  break
}

console.log(sigData)
console.log(keyUtil.keyToString('SIG', 'SM2', sigData))
