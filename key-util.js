#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const ripemd160 = require('ripemd160')
const bs = require('bs58')
const bsc = require('bs58check')
const elliptic = require('elliptic')
const BN = require('bn.js')
const debug = require('debug')('secp256k1-tools:key-util')

module.exports = {
  EXAMPLE_PRIVATE_KEY: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
  , EXAMPLE_PUBLIC_KEY: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'

  , legacyPublicKeyToString: (prefix, payload) => {
    const checksum = new ripemd160().update(payload).digest().slice(0, 4)
    return prefix + bs.encode(Buffer.concat([payload, checksum]))
  }

  , stringToLegacyPrivateKey: (pk) => {
    const bytes = bsc.decode(pk)
    if (0x80 !== bytes[0]) {
      throw new Error('unrecognized private key format')
    }
    return bytes.slice(1)
  }

  , stringToLegacyPublicKey: (pubkey) => {
    const bytes = bs.decode(pubkey)
    const keyLength = bytes.length - 4
    const payload = bytes.slice(0, keyLength)
    const checksum = bytes.slice(keyLength)
    const expected = new ripemd160().update(payload).digest().slice(0, 4)
    if (!checksum.equals(expected)) {
      throw new Error('public key\'s checksum doesn\'t match')
    }
    return payload
  }

  , stringToKey: (pk) => {
    const arr = pk.split('_')
    if (arr.length !== 3 || !['PVT', 'PUB', 'SIG'].includes(arr[0])) {
      throw new Error('unrecognized key format')
    }
    const type = arr[1]
    const bytes = bs.decode(arr[2])
    const keyLength = bytes.length - 4
    const payload = bytes.slice(0, keyLength)
    const checksum = bytes.slice(keyLength)
    const buf = Buffer.concat([payload, Buffer.from(type)])
    const expected = new ripemd160().update(buf).digest().slice(0, 4)
    if (!checksum.equals(expected)) {
      throw new Error('checksum doesn\'t match')
    }
    return { prefix: arr[0], type: type, payload: payload }
  }

  , keyToString: (prefix, type, payload) => {
    const bytes = Buffer.concat([payload, Buffer.from(type)])
    const checksum = new ripemd160().update(bytes).digest().slice(0, 4)
    return prefix + '_' + type + '_'
      + bs.encode(Buffer.concat([payload, checksum]))
  }

  , convertLegacyPrivateKey: (lpk) => {
    if (!lpk || lpk.length !== 51) {
      return 'INVALID_PRIVATE_KEY'
    }
    return module.exports.keyToString('PVT', 'K1'
      , module.exports.stringToLegacyPrivateKey(lpk))
  }
  
  , convertLegacyPublicKey: (lpk) => {
    if (!lpk || lpk.length < 50) {
      return 'INVALID_PUBLIC_KEY'
    }
    return module.exports.keyToString('PUB', 'K1'
      , module.exports.stringToLegacyPublicKey(lpk.slice(lpk.length - 50)))
  }

  , getPointFromEcc: (n, curve) => {
    if (!curve) {
      curve = elliptic.curves.secp256k1
    } else if (typeof curve === 'string') {
      if (curve === 'secp256k1') {
        curve = elliptic.curves.secp256k1
      } else if (curve === 'p256' || curve === 'secp256r1') {
        curve = elliptic.curves.p256
      } else if (curve === 'sm2') {
        const sm3 = require('sm3.js').sm3
        curve = new elliptic.ec(new elliptic.curves.PresetCurve({
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
      }
    }
    const pvt = new BN(n, 'be')
    debug('pvt =', pvt.toString('hex'))
    const pub = curve.g.mul(pvt)
    debug('x =', pub.getX().toString('hex'))
    debug('y =', pub.getY().toString('hex'))
    const y = pub.getY().isEven() ? 2 : 3
    return Buffer.from([y].concat(pub.getX().toArray()))
  }
}
