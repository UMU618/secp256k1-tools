#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const assert = require('assert')
const BN = require('bn.js')
const elliptic = require('elliptic')

// K1 succeeded
const k1 = elliptic.curves.secp256k1
console.log('secp256k1 beta of p:', k1.curve.endo.beta.toString(16))
console.log('secp256k1 lambda of n:', k1.curve.endo.lambda.toString(16))
const p1 = k1.g.mul(k1.curve.endo.lambda)

assert(p1.getX().toString(16) == k1.g.getX().mul(k1.curve.endo.beta).umod(k1.curve.p).toString(16))
assert(p1.getY().toString(16) == k1.g.getY().toString(16))

// R1 failed
const r1 = new elliptic.ec('p256')
r1.curve.endo = {
  beta: new BN('b291576c752479319dc77571f109dcced1973a65210c1ac0269ba67147e65330', 16)
  , lambda: new BN('ad76e2bb26b95fcbb18792f88802951028e1c750bd4f606776fa42c3e9dad72f', 16)
}
console.log('secp256r1 beta of p:', r1.curve.endo.beta.toString(16))
console.log('secp256r1 lambda of n:', r1.curve.endo.lambda.toString(16))
const p2 = r1.g.mul(r1.curve.endo.lambda)

assert(p2.getX().toString(16) == r1.g.getX().mul(r1.curve.endo.beta).umod(r1.curve.p).toString(16))
assert(p2.getY().toString(16) == r1.g.getY().toString(16))
