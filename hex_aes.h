/* SPDX-License-Identifier: BSL-1.0
Copyright (c) 2020 Pavlos Georgiou

Distributed under the Boost Software License, Version 1.0.
See accompanying file LICENSE_1_0.txt or copy at
https://www.boost.org/LICENSE_1_0.txt
*/

#ifndef HEX_AES_H
#define HEX_AES_H

#include "vial_aes/aes.h"

#ifdef __cplusplus
extern "C" {
#endif

char *hex_encode(const uint8_t *src, size_t len);

uint8_t *hex_decode(const char *src);

char *hex_encrypt(enum vial_aes_mode mode, const char *hex_key, const char *hex_iv, const char *hex_plain);

char *hex_decrypt(enum vial_aes_mode mode, const char *hex_key, const char *hex_iv, const char *hex_cipher);

char *hex_cmac(const char *hex_key, const char *hex_in);

#ifdef __cplusplus
}
#endif

#endif
