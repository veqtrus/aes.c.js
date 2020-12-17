/* SPDX-License-Identifier: BSL-1.0
Copyright (c) 2020 Pavlos Georgiou

Distributed under the Boost Software License, Version 1.0.
See accompanying file LICENSE_1_0.txt or copy at
https://www.boost.org/LICENSE_1_0.txt
*/

#include "hex_aes.h"

#include <string.h>
#include <stdlib.h>

char *hex_encode(const uint8_t *src, size_t len)
{
	static const char hex[] = "0123456789abcdef";
	char *result = malloc(len * 2 + 1);
	for (size_t i = 0; i < len; ++i) {
		result[i * 2] = hex[src[i] >> 4];
		result[i * 2 + 1] = hex[src[i] & 15];
	}
	result[len * 2] = 0;
	return result;
}

uint8_t *hex_decode(const char *src)
{
	if (src == NULL)
		return NULL;
	const size_t len = strlen(src);
	uint8_t *result = malloc(len / 2);
	unsigned digit;
	for (size_t i = 0; i < len; ++i) {
		digit = src[i];
		if (digit >= '0' && digit <= '9') {
			digit -= '0';
		} else if (digit >= 'A' && digit <= 'F') {
			digit -= 'A' - 10;
		} else if (digit >= 'a' && digit <= 'f') {
			digit -= 'a' - 10;
		} else {
			free(result);
			return NULL;
		}
		if (i % 2 == 0)
			result[i / 2] = digit * 16;
		else
			result[i / 2] += digit;
	}
	return result;
}

static char *error_message(enum vial_aes_error err, const char *msg)
{
	const size_t msg_len = msg != NULL ? strlen(msg) : 0;
	const size_t buf_size = msg_len + 32;
	char *buf = malloc(buf_size);
	strcpy(buf, "!AES error: ");
	switch (err) {
	case VIAL_AES_ERROR_LENGTH:
		strcat(buf, "Length");
		break;
	case VIAL_AES_ERROR_IV:
		strcat(buf, "IV");
		break;
	case VIAL_AES_ERROR_MAC:
		strcat(buf, "MAC");
		break;
	case VIAL_AES_ERROR_CIPHER:
		strcat(buf, "Cipher");
		break;
	default:
		strcat(buf, "Other");
		break;
	}
	if (msg_len > 0) {
		strcat(buf, ": ");
		strcat(buf, msg);
	}
	return buf;
}

static char *aes_key_init_hex(struct vial_aes_key *key, const char *hex_key)
{
	enum vial_aes_error err;
	uint8_t *key_buf = hex_decode(hex_key);
	if (key_buf == NULL)
		return error_message(VIAL_AES_ERROR_NONE, "Key hex invalid");
	err = vial_aes_key_init(key, strlen(hex_key) * 4, key_buf);
	free(key_buf);
	if (err != VIAL_AES_ERROR_NONE)
		return error_message(err, "Key");
	return NULL;
}

static char *aes_init_hex(struct vial_aes *aes, const struct vial_aes_key *key,
	enum vial_aes_mode mode, const char *hex_iv)
{
	enum vial_aes_error err;
	uint8_t *iv_buf = hex_decode(hex_iv);
	if (iv_buf == NULL)
		return error_message(VIAL_AES_ERROR_NONE, "IV hex invalid");
	err = vial_aes_init(aes, mode, key, iv_buf);
	free(iv_buf);
	if (err != VIAL_AES_ERROR_NONE)
		return error_message(err, "Init");
	return NULL;
}

char *hex_encrypt(enum vial_aes_mode mode, const char *hex_key, const char *hex_iv, const char *hex_plain)
{
	struct vial_aes_key key;
	struct vial_aes aes;
	char *result;
	enum vial_aes_error err;
	const size_t len = strlen(hex_plain) / 2;
	result = aes_key_init_hex(&key, hex_key);
	if (result != NULL)
		return result;
	result = aes_init_hex(&aes, &key, mode, hex_iv);
	if (result != NULL)
		return result;
	uint8_t *buf = hex_decode(hex_plain);
	if (buf == NULL)
		return error_message(VIAL_AES_ERROR_NONE, "Plaintext hex invalid");
	err = vial_aes_encrypt(&aes, buf, buf, len);
	if (err != VIAL_AES_ERROR_NONE) {
		free(buf);
		return error_message(err, "Encryption");
	}
	result = hex_encode(buf, len);
	free(buf);
	return result;
}

char *hex_decrypt(enum vial_aes_mode mode, const char *hex_key, const char *hex_iv, const char *hex_cipher)
{
	struct vial_aes_key key;
	struct vial_aes aes;
	char *result;
	enum vial_aes_error err;
	const size_t len = strlen(hex_cipher) / 2;
	result = aes_key_init_hex(&key, hex_key);
	if (result != NULL)
		return result;
	result = aes_init_hex(&aes, &key, mode, hex_iv);
	if (result != NULL)
		return result;
	uint8_t *buf = hex_decode(hex_cipher);
	if (buf == NULL)
		return error_message(VIAL_AES_ERROR_NONE, "Ciphertext hex invalid");
	err = vial_aes_decrypt(&aes, buf, buf, len);
	if (err != VIAL_AES_ERROR_NONE) {
		free(buf);
		return error_message(err, "Decryption");
	}
	result = hex_encode(buf, len);
	free(buf);
	return result;
}

char *hex_cmac(const char *hex_key, const char *hex_in)
{
	struct vial_aes_key key;
	char *result;
	const size_t len = strlen(hex_in) / 2;
	result = aes_key_init_hex(&key, hex_key);
	if (result != NULL)
		return result;
	uint8_t *buf = hex_decode(hex_in);
	if (buf == NULL)
		return error_message(VIAL_AES_ERROR_NONE, "Input hex invalid");
	uint8_t tag[VIAL_AES_BLOCK_SIZE];
	vial_aes_cmac_tag(&key, tag, sizeof(tag), buf, len);
	free(buf);
	return hex_encode(tag, sizeof(tag));
}
