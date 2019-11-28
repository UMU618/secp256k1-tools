#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const keyUtil = require('./key-util')

const bsc = require('bs58check')
const EC = require('elliptic').ec
const k1 = new EC('secp256k1')
const key = k1.genKeyPair()

const pri = key.getPrivate()
console.log(pri)
const prikey = bsc.encode(Buffer.from([0x80].concat(pri.toArray())))
console.log(keyUtil.convertLegacyPrivateKey(prikey), prikey)

const pub = key.getPublic()
const y = pub.getY().isEven() ? 2 : 3
const pubkey = keyUtil.legacyPublicKeyToString('EOS'
  , Buffer.from([y].concat(pub.getX().toArray())))
console.log(keyUtil.convertLegacyPublicKey(pubkey), pubkey)
