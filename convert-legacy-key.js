#!/usr/bin/env node

/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const bsc = require('bs58check')

const keyUtil = require('./key-util')

if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; ++i) {
    console.log('[' + (i - 1) + ']', process.argv[i], '='
      , process.argv[i].length === 51
      ? keyUtil.convertLegacyPrivateKey(process.argv[i])
      : keyUtil.convertLegacyPublicKey(process.argv[i]))
  }
} else {
  console.log(process.argv[1], 'pubkey [...]')
  console.log('')
  console.log(keyUtil.EXAMPLE_PRIVATE_KEY, '='
    , keyUtil.convertLegacyPrivateKey(keyUtil.EXAMPLE_PRIVATE_KEY))
  console.log(keyUtil.EXAMPLE_PUBLIC_KEY, '='
    , keyUtil.convertLegacyPublicKey(keyUtil.EXAMPLE_PUBLIC_KEY))
}
