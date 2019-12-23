#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 * node precompute.js > secp256k1.js
 * node precompute.js > secp256r1.js
 */

'use strict'

const BN = require('bn.js')
const elliptic = require('elliptic')

//const ec = elliptic.curves.secp256k1
const ec = new elliptic.ec('p256')  // secp256r1
const step = 4
const times = new BN(2 ** step, 'be')
let pub = ec.g

console.log('module.exports = {')
console.log('  doubles: {')
console.log('    step: 4,')
console.log('    points: [')

for (let i = 0; i <= 256; i += step) {
  pub = pub.mul(times)
  console.log('      [')
  console.log("        '" + pub.getX().toString(16) + "',")
  console.log("        '" + pub.getY().toString(16) + "'")
  console.log('      ]' + (i < 256 ? ',' : ''))
}

console.log('    ]')
console.log('  },')

console.log('  naf: {')
console.log('    wnd: 7,')
console.log('    points: [')

pub = ec.g
const addend = ec.g.mul(2)

for (let i = 3; i <= 255; i += 2) {
  pub = pub.add(addend)
  console.log('      [')
  console.log("        '" + pub.getX().toString(16) + "',")
  console.log("        '" + pub.getY().toString(16) + "'")
  console.log('      ]' + (i < 255 ? ',' : ''))
}

console.log('    ]')
console.log('  }')
console.log('};')
