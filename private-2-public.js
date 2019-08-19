#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const bsc = require('bs58check')
const ripemd160 = require('ripemd160')
const bs = require('bs58')
const elliptic = require('elliptic')
const BN = require('bn.js')

function encodePublicKey(payload) {
  const checksum = new ripemd160().update(payload).digest().slice(0, 4)

  return bs.encode(Buffer.concat([payload, checksum]))
}

function privateKeyToPublicKey(privateKey) {
  const buf = bsc.decode(privateKey)
  if (0x80 !== buf[0]) {
    throw new Error('Not a private key.')
  }
  const k1 = elliptic.curves.secp256k1
  const pvt = new BN(buf.slice(1), 'be')
  const pub = k1.g.mul(pvt)
  const y = pub.getY().isEven() ? 2 : 3
  return 'EOS' + encodePublicKey(Buffer.from([y].concat(pub.getX().toArray())))
}

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    const privateKey = process.argv[i]
    const publicKey = privateKeyToPublicKey(privateKey)

    console.log(privateKey)
    console.log(publicKey)
  }
} else {
  const privateKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
  const publicKey = privateKeyToPublicKey(privateKey)
  console.log(privateKey)
  console.log(publicKey)
}
