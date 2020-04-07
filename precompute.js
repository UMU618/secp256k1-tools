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

const ec = elliptic.curves.secp256k1
//const ec = new elliptic.ec('p256')  // secp256r1
// const ec = new elliptic.ec(new elliptic.curves.PresetCurve({
//   type: 'short'
//   , prime: null
//   , p: 'fffffffe ffffffff ffffffff ffffffff ffffffff 00000000 ffffffff ffffffff'
//   , a: 'fffffffe ffffffff ffffffff ffffffff ffffffff 00000000 ffffffff fffffffc'
//   , b: '28e9fa9e 9d9f5e34 4d5a9e4b cf6509a7 f39789f5 15ab8f92 ddbcbd41 4d940e93'
//   , n: 'fffffffe ffffffff ffffffff ffffffff 7203df6b 21c6052b 53bbf409 39d54123'
//   , hash: null
//   , gRed: false
//   , g: [
//     '32c4ae2c1f1981195f9904466a39c9948fe30bbff2660be1715a4589334c74c7',
//     'bc3736a2f4f6779c59bdcee36b692153d0a9877cc62a474002df32e52139f0a0'
//   ]
// }))
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

/* https://sagecell.sagemath.org/
p = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f
F = GF(p)
beta_of_p = F(2) ** ((p - 1) / 3)
hex(beta_of_p)
0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee

n = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141
K = GF(n)
lambda_of_n = K(3) ** ((n - 1) / 3)
hex(lambda_of_n)
0x5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72

// R1
p = 0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff
print("beta of p = 0x%x" % pow(2, (p-1)//3, p))
beta of p = 0xb291576c752479319dc77571f109dcced1973a65210c1ac0269ba67147e65330

n = 0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551
print("lambda of n = 0x%x" % pow(3, (n-1)//3, n))
lambda of n = 0xad76e2bb26b95fcbb18792f88802951028e1c750bd4f606776fa42c3e9dad72f

// SM2
p = 0xfffffffeffffffffffffffffffffffffffffffff00000000ffffffffffffffff
is_prime(p)
True

p = 0xfffffffeffffffffffffffffffffffffffffffff00000000ffffffffffffffff
F = GF(p)
beta_of_p = F(2) ** ((p - 1) / 3)
hex(beta_of_p)
print("beta of p = 0x%x" % pow(2, (p-1)//3, p))
0x2f1c1edfc0f08bc32bf3d9251d1592cdbc07fc7c7cda994427bdacc8555d7051

n = 0xfffffffeffffffffffffffffffffffff7203df6b21c6052b53bbf40939d54123
K = GF(n)
lambda_of_n = K(3) ** ((n - 1) / 3)
hex(lambda_of_n)
0xb2f502a3015e98e1a4c76e905b447b016a192ebb20dd6c778229b495d34ba8a1
*/