#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2018
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const keyUtil = require('./key-util')

const BN = require('bn.js')
const elliptic = require('elliptic')
const debug = require('debug')('secp256k1-tools:recover')

function recover(hash, sig) {
  const h = new BN(hash, 16, 'be')
  const { payload } = keyUtil.stringToKey(sig)

  const x = new BN(payload.slice(1, 1 + 32))
  debug('x =', x.toString(16))
  const s = new BN(payload.slice(1 + 32, 1 + 32 + 32))
  debug('s =', s.toString(16))

  const k1 = elliptic.curves.secp256k1
  const rg = k1.curve.pointFromX(x, (payload[0] - 27) & 1)
  debug('rg = [' + rg.getX().toString(16) + ', ' + rg.getY().toString(16) + ']')

  // u1 = h/s
  const sinv = s.invm(k1.n)
  const u1 = h.mul(sinv).umod(k1.n)
  const p1 = k1.g.mul(u1)
  const opposite_p1 = k1.curve.pointFromX(p1.getX(), !p1.getY().isOdd())
  const u2 = rg.add(opposite_p1)

  const xinv = x.invm(k1.n)
  const K = u2.mul(s).mul(xinv)

  debug('K =', K.getX().toString(16))
  return keyUtil.keyToString('PUB', 'K1', Buffer.from(
    [K.getY().isEven() ? 2 : 3].concat(K.getX().toArray())))
}

if (process.argv.length > 3) {
  for (let i = 2; i < process.argv.length; i += 2) {
    console.log('Recover(' + process.argv[i] + ', ' + process.argv[i + 1]
       + ') =', recover(process.argv[i], process.argv[i + 1]))
  }
} else {
  const h = 'cc1839b254811f68631e64d203261fa88af8fc83c40ecb9822986695b55eb694'
  const sig = 'SIG_K1_Gg74ULRryVHxYZvMRLJgTrAZW6PZGC5SYfUiswtMJxBwfTTnGEnTejeWXopL2oSs8EZD7mqAC8mCps6VKq95Bgic9tGNHJ'

  console.log('Recover(' + h + ', ' + sig + ') =', recover(h, sig))
}
