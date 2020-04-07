#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2018
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const keyUtil = require('./key-util')

const BN = require('bn.js')
const sm3 = require('sm3.js').sm3
const { ec, curves } = require('elliptic')
const debug = require('debug')('secp256k1-tools:recover')

function recover(hash, sig) {
  const h = new BN(hash, 16, 'be')
  const { payload } = keyUtil.stringToKey(sig)

  const x = new BN(payload.slice(1, 1 + 32))
  debug('x =', x.toString(16))
  const s = new BN(payload.slice(1 + 32, 1 + 32 + 32))
  debug('s =', s.toString(16))

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
  const rg = curve.curve.pointFromX(x, (payload[0] - 27) & 1)
  debug('rg = [' + rg.getX().toString(16) + ', ' + rg.getY().toString(16) + ']')

  // u1 = h/s
  const sinv = s.invm(curve.n)
  const u1 = h.mul(sinv).umod(curve.n)
  const p1 = curve.g.mul(u1)
  const opposite_p1 = curve.curve.pointFromX(p1.getX(), !p1.getY().isOdd())
  const u2 = rg.add(opposite_p1)

  const xinv = x.invm(curve.n)
  const K = u2.mul(s).mul(xinv)

  debug('K = [' + K.getX().toString(16) + ', ' + K.getY().toString(16) + ']')
  return keyUtil.keyToString('PUB', 'SM2', Buffer.from(
    [K.getY().isEven() ? 2 : 3].concat(K.getX().toArray())))
}

if (process.argv.length > 3) {
  for (let i = 2; i < process.argv.length; i += 2) {
    const h = process.argv[i]
    const sig = process.argv[i + 1]

    console.log('Recover(' + h + ', ' + sig + ') =', recover(h, sig))
  }
} else {
  const h = 'be6be53e426652f41c2a79b9fedc1410602218f43cf0931c57898f36620ff10d'
  const sig = 'SIG_SM2_K44nA6sEHKtCiYCy3m5ka7rJpYBoRBwRgti8yZ2ke988wYKnKhCg9qLCf7CT1EULyWJ7EEFrTx2nbeQsdNUVtEohkrjMjK'

  console.log('Recover(' + h + ', ' + sig + ') =', recover(h, sig))
}
