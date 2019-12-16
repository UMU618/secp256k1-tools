#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const assert = require('assert')
const BN = require('bn.js')

const keyUtil = require('./key-util')

// test hex string:
// keyUtil.stringToLegacyPrivateKey(keyUtil.EXAMPLE_PRIVATE_KEY).toString('hex')
// d2653ff7cbb2d8ff129ac27ef5781ce68b2558c41a74af1f2ddca635cbeef07d

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    const hex = process.argv[i]
    if (hex.length === 64) {
      const payload = Buffer.from(hex, 'hex')
      const privateKey = keyUtil.keyToString('PVT', 'K1', payload)
      const publicKey = keyUtil.keyToString('PUB', 'K1'
        , keyUtil.getPointFromEcc(payload))

      console.log(privateKey)
      console.log(publicKey)
    } else if (hex.length === 130) {
      const b = Buffer.from(hex, 'hex')
      assert((b[0] === 4) && (b[33] === 0x0b))
      const x = b.slice(1, 33)
      const y = new BN(b.slice(34, 66), 'be')
      const publicKey = keyUtil.keyToString('PUB', 'K1'
        , Buffer.concat([Buffer.from([y.isEven() ? 2 : 3]), x]))
      console.log(publicKey)
    }
  }
} else {
  console.log('Usage: ' + process.argv[1] + ' hexString1 ... hexStringN')
}
