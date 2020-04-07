#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const keyUtil = require('./key-util')

function getPointFromEcc(n) {
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
  const pvt = new BN(n, 'be')
  debug('pvt =', pvt.toString('hex'))
  const pub = k1.g.mul(pvt)
  debug('x =', pub.getX().toString('hex'))
  debug('y =', pub.getY().toString('hex'))
  const y = pub.getY().isEven() ? 2 : 3
  return Buffer.from([y].concat(pub.getX().toArray()))
}

function legacyPrivateKeyToPublicKey(privateKey) {
  const payload = keyUtil.stringToLegacyPrivateKey(privateKey)
  return keyUtil.legacyPublicKeyToString('EOS', getPointFromEcc(payload))
}

function privateKeyToPublicKey(privateKey) {
  const { type, payload } = keyUtil.stringToKey(privateKey)
  if (type !== 'K1') {
    throw Error('Only support K1.')
  }
  return keyUtil.keyToString('PUB', type, getPointFromEcc(payload))
}

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    const privateKey = process.argv[i]
    if (privateKey.startsWith('PVT_K1_')) {
      const publicKey = privateKeyToPublicKey(privateKey)

      console.log(privateKey)
      console.log(publicKey)
    } else {
      const publicKey = legacyPrivateKeyToPublicKey(privateKey)

      console.log(keyUtil.convertLegacyPrivateKey(privateKey), privateKey)
      console.log(keyUtil.convertLegacyPublicKey(publicKey), publicKey)
    }
  }
} else {
  const privateKey = keyUtil.EXAMPLE_PRIVATE_KEY
  const publicKey = legacyPrivateKeyToPublicKey(privateKey)
  console.log(keyUtil.convertLegacyPrivateKey(privateKey), privateKey)
  console.log(keyUtil.convertLegacyPublicKey(publicKey), publicKey)
}
