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

const isCanonical = (n) => {
  // MUST be in range [0x0080..00, 0x7fff..ff]
  return !(n[0] & 0x80) && !(n[0] === 0 && !(n[1] & 0x80))
}

function getX(sig) {
  const { payload } = keyUtil.stringToKey(sig)
  const x = new BN(payload.slice(1, 1 + 32))
  if (!isCanonical(x)) {
    console.error('NOT Canonical!')
  }
  return x.toString(16)
}

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    const sig = process.argv[i]
    console.log('GetX(' + sig + ') =', getX(sig))
  }
} else {
  const sig = 'SIG_K1_Gg74ULRryVHxYZvMRLJgTrAZW6PZGC5SYfUiswtMJxBwfTTnGEnTejeWXopL2oSs8EZD7mqAC8mCps6VKq95Bgic9tGNHJ'
  console.log('GetX(' + sig + ') =', getX(sig))
}
