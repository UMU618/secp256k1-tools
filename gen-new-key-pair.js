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
const prikey = keyUtil.keyToString('PVT', 'K1', pri.toBuffer())
console.log(prikey)

const pub = key.getPublic()
const y = pub.getY().isEven() ? 2 : 3
const pubkey = keyUtil.keyToString('PUB', 'K1'
  , Buffer.from([y].concat(pub.getX().toArray())))
console.log(pubkey)
