#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const keyUtil = require('./key-util')

const { ec, curves } = require('elliptic')
const sm3 = require('sm3.js').sm3
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
const key = curve.genKeyPair()

const pri = key.getPrivate()
//console.log(pri)
const prikey = keyUtil.keyToString('PVT', 'SM2', pri.toBuffer())
console.log(prikey)

const pub = key.getPublic()
const y = pub.getY().isEven() ? 2 : 3
const pubkey = keyUtil.keyToString('PUB', 'SM2'
  , Buffer.from([y].concat(pub.getX().toArray())))
console.log(pubkey)
