#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const elliptic = require('elliptic')
const BN = require('bn.js')

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    const x = new BN(process.argv[i], 10, 'be')
    console.log('[' + (i - 1) + ']')
    console.log('  x =', x.toString())

    const p2 = elliptic.curves.secp256k1.curve.pointFromX(x, false)
    const p3 = elliptic.curves.secp256k1.curve.pointFromX(x, true)
    console.log('  y2 = ', p2.getY().toString())
    console.log('  y3 = ', p3.getY().toString())
  }
} else {
  console.log(process.argv[1], 'x')
}
