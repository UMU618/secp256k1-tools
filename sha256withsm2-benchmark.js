#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 * secp256k1 precomputed
 * secp256r1 NOT
 * sm2 manual precomputed
 */

'use strict'

const { ec, curves } = require('elliptic')
//const curve = new ec('secp256k1')
//const curve = new ec('p256')
const sm2 = require('./sm2')
const hash = require('hash.js')
const start = Date.now()
const curve = new ec(new curves.PresetCurve({
  type: 'short'
  , prime: null
  , p: 'fffffffe ffffffff ffffffff ffffffff ffffffff 00000000 ffffffff ffffffff'
  , a: 'fffffffe ffffffff ffffffff ffffffff ffffffff 00000000 ffffffff fffffffc'
  , b: '28e9fa9e 9d9f5e34 4d5a9e4b cf6509a7 f39789f5 15ab8f92 ddbcbd41 4d940e93'
  , n: 'fffffffe ffffffff ffffffff ffffffff 7203df6b 21c6052b 53bbf409 39d54123'
  , hash: hash.sha256
  , gRed: false
  , g: [
    '32c4ae2c1f1981195f9904466a39c9948fe30bbff2660be1715a4589334c74c7'
    , 'bc3736a2f4f6779c59bdcee36b692153d0a9877cc62a474002df32e52139f0a0'
    , sm2
  ]
}))

const privateKey = [
  36, 211, 214,  45,  20, 219,  85, 150,
 131, 173,  20,  61,  37, 129, 232,  80,
  34, 152, 102, 149, 181,  94, 182, 148,
 138, 248, 252, 131, 196,  14, 203, 152
]

let digest = [
  204,  24,  57, 178,  84, 129,  31, 104,
   99,  30, 100, 210,   3,  38,  31, 168,
  138, 248, 252, 131, 196,  14, 203, 152,
   34, 152, 102, 149, 181,  94, 182, 148
]

const key = curve.keyFromPrivate(privateKey)

// const start = Date.now()
for (let i = 0; i < 10000; ++i) {
  const sig = key.sign(digest)
  digest = sig.s.toArray()
}
console.log(Date.now() - start)
