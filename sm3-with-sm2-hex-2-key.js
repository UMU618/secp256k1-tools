#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 * @reference http://www.jonllen.com/upload/jonllen/case/jsrsasign-master/sample-sm2.html
 * @test 72cdc4f025f9fb2338e1ff87b68d8f0fa83d387785440d36be2e57c2ccf44895
 * 046a4f4b709d32d9de82cfc78a153d87494ae186117d0af2cc14db7c1a84575c35084c427de080b6979a92bfd87f03f4a7c29f7feca0fcda172832e0a97d575280
 */

'use strict'

const assert = require('assert')
const BN = require('bn.js')
const keyUtil = require('./key-util')
const elliptic = require('elliptic')
const sm3 = require('sm3')

const getPointFromSM2 = (n) => {
  const sm2 = new elliptic.ec(new elliptic.curves.PresetCurve({
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
  const pvt = new BN(n, 'be')
  const pub = sm2.g.mul(pvt)
  const y = pub.getY().isEven() ? 2 : 3
  return Buffer.from([y].concat(pub.getX().toArray()))
}

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    const hex = process.argv[i]
    if (hex.length === 64) {
      const payload = Buffer.from(hex, 'hex')
      const privateKey = keyUtil.keyToString('PVT', 'SM2', payload)
      const publicKey = keyUtil.keyToString('PUB', 'SM2'
        , getPointFromSM2(payload))

      console.log(privateKey)
      console.log(publicKey)
    } else if (hex.length === 130) {
      const b = Buffer.from(hex, 'hex')
      assert(b[0] === 4)
      const x = b.slice(1, 33)
      const y = new BN(b.slice(33, 65), 'be')
      const publicKey = keyUtil.keyToString('PUB', 'SM2'
        , Buffer.concat([Buffer.from([y.isEven() ? 2 : 3]), x]))
      console.log(publicKey)
    }
  }
} else {
  console.log('Usage: ' + process.argv[1] + ' hexString1 ... hexStringN')
}
