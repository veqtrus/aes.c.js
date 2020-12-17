/* SPDX-License-Identifier: BSL-1.0
Copyright (c) 2020 Pavlos Georgiou

Distributed under the Boost Software License, Version 1.0.
See accompanying file LICENSE_1_0.txt or copy at
https://www.boost.org/LICENSE_1_0.txt
*/

import aes_asm = require("./aes_asm");

export enum CipherMode {
	ECB, CBC, CTR, EAX
}

export function crypt(encryption: boolean, mode: CipherMode | string,
		hexKey: string, hexIV: string | null, hexInput: string): string {
	hexIV = hexIV || "";
	const modeNo = (typeof mode === "string" ? CipherMode[mode] : mode) | 0;
	const fn = encryption ? "hex_encrypt" : "hex_decrypt";
	const resultPtr: number = aes_asm.ccall(fn, "number",
		["number", "string", "string", "string"],
		[modeNo, hexKey, hexIV, hexInput]);
	const result: string = aes_asm.UTF8ToString(resultPtr);
	aes_asm._free(resultPtr);
	if (result.charAt(0) == "!") {
		throw new Error(result);
	}
	return result;
}

export function encrypt(mode: CipherMode | string, hexKey: string, hexIV: string | null, hexInput: string) {
	return crypt(true, mode, hexKey, hexIV, hexInput);
}

export function decrypt(mode: CipherMode | string, hexKey: string, hexIV: string | null, hexInput: string) {
	return crypt(false, mode, hexKey, hexIV, hexInput);
}

export function cmac(hexKey: string, hexInput: string): string {
	const resultPtr: number = aes_asm.ccall("hex_cmac", "number",
		["string", "string"], [hexKey, hexInput]);
	const result: string = aes_asm.UTF8ToString(resultPtr);
	aes_asm._free(resultPtr);
	if (result.charAt(0) == "!") {
		throw new Error(result);
	}
	return result;
}
