(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.AES = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/* SPDX-License-Identifier: BSL-1.0
Copyright (c) 2020 Pavlos Georgiou

Distributed under the Boost Software License, Version 1.0.
See accompanying file LICENSE_1_0.txt or copy at
https://www.boost.org/LICENSE_1_0.txt
*/
exports.__esModule = true;
exports.cmac = exports.decrypt = exports.encrypt = exports.crypt = exports.CipherMode = void 0;
var aes_asm = require("./aes_asm");
var CipherMode;
(function (CipherMode) {
    CipherMode[CipherMode["ECB"] = 0] = "ECB";
    CipherMode[CipherMode["CBC"] = 1] = "CBC";
    CipherMode[CipherMode["CTR"] = 2] = "CTR";
    CipherMode[CipherMode["EAX"] = 3] = "EAX";
})(CipherMode = exports.CipherMode || (exports.CipherMode = {}));
function crypt(encryption, mode, hexKey, hexIV, hexInput) {
    hexIV = hexIV || "";
    var modeNo = (typeof mode === "string" ? CipherMode[mode] : mode) | 0;
    var fn = encryption ? "hex_encrypt" : "hex_decrypt";
    var resultPtr = aes_asm.ccall(fn, "number", ["number", "string", "string", "string"], [modeNo, hexKey, hexIV, hexInput]);
    var result = aes_asm.UTF8ToString(resultPtr);
    aes_asm._free(resultPtr);
    if (result.charAt(0) == "!") {
        throw new Error(result);
    }
    return result;
}
exports.crypt = crypt;
function encrypt(mode, hexKey, hexIV, hexInput) {
    return crypt(true, mode, hexKey, hexIV, hexInput);
}
exports.encrypt = encrypt;
function decrypt(mode, hexKey, hexIV, hexInput) {
    return crypt(false, mode, hexKey, hexIV, hexInput);
}
exports.decrypt = decrypt;
function cmac(hexKey, hexInput) {
    var resultPtr = aes_asm.ccall("hex_cmac", "number", ["string", "string"], [hexKey, hexInput]);
    var result = aes_asm.UTF8ToString(resultPtr);
    aes_asm._free(resultPtr);
    if (result.charAt(0) == "!") {
        throw new Error(result);
    }
    return result;
}
exports.cmac = cmac;

},{"./aes_asm":2}],2:[function(require,module,exports){
(function (process,Buffer,__dirname){(function (){
var Module=typeof exports!=="undefined"?exports:{};var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}var arguments_=[];var thisProgram="./this.program";var quit_=function(status,toThrow){throw toThrow};var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;var nodeFS;var nodePath;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require("path").dirname(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}read_=function shell_read(filename,binary){var ret=tryParseAsDataURI(filename);if(ret){return binary?ret:ret.toString()}if(!nodeFS)nodeFS=require("fs");if(!nodePath)nodePath=require("path");filename=nodePath["normalize"](filename);return nodeFS["readFileSync"](filename,binary?null:"utf8")};readBinary=function readBinary(filename){var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/")}arguments_=process["argv"].slice(2);if(typeof module!=="undefined"){module["exports"]=Module}process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",abort);quit_=function(status){process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){read_=function shell_read(f){var data=tryParseAsDataURI(f);if(data){return intArrayToString(data)}return read(f)}}readBinary=function readBinary(f){var data;data=tryParseAsDataURI(f);if(data){return data}if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){arguments_=scriptArgs}else if(typeof arguments!="undefined"){arguments_=arguments}if(typeof quit==="function"){quit_=function(status){quit(status)}}if(typeof print!=="undefined"){if(typeof console==="undefined")console={};console.log=print;console.warn=console.error=typeof printErr!=="undefined"?printErr:print}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!=="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=function shell_read(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};if(ENVIRONMENT_IS_WORKER){readBinary=function readBinary(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}}}readAsync=function readAsync(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function xhr_onload(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}var data=tryParseAsDataURI(url);if(data){onload(data.buffer);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=function(title){document.title=title}}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var STACK_ALIGN=16;function warnOnce(text){if(!warnOnce.shown)warnOnce.shown={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;err(text)}}function convertJsFunctionToWasm(func,sig){return func}var freeTableIndexes=[];var functionsInTableMap;function getEmptyTableSlot(){if(freeTableIndexes.length){return freeTableIndexes.pop()}try{wasmTable.grow(1)}catch(err){if(!(err instanceof RangeError)){throw err}throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."}return wasmTable.length-1}function addFunctionWasm(func,sig){if(!functionsInTableMap){functionsInTableMap=new WeakMap;for(var i=0;i<wasmTable.length;i++){var item=wasmTable.get(i);if(item){functionsInTableMap.set(item,i)}}}if(functionsInTableMap.has(func)){return functionsInTableMap.get(func)}var ret=getEmptyTableSlot();try{wasmTable.set(ret,func)}catch(err){if(!(err instanceof TypeError)){throw err}var wrapped=convertJsFunctionToWasm(func,sig);wasmTable.set(ret,wrapped)}functionsInTableMap.set(func,ret);return ret}var tempRet0=0;var setTempRet0=function(value){tempRet0=value};var getTempRet0=function(){return tempRet0};var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime;if(Module["noExitRuntime"])noExitRuntime=Module["noExitRuntime"];var WebAssembly={Memory:function(opts){this.buffer=new ArrayBuffer(opts["initial"]*65536)},Module:function(binary){},Instance:function(module,info){this.exports=(
// EMSCRIPTEN_START_ASM
function instantiate(na){function ia(oa){oa.set=(function(c,pa){this[c]=pa});oa.get=(function(c){return this[c]});return oa}var a;var b=new Uint8Array(123);for(var c=25;c>=0;--c){b[48+c]=52+c;b[65+c]=c;b[97+c]=26+c}b[43]=62;b[47]=63;function ja(qa,ra,sa){var d,e,c=0,f=ra,g=sa.length,h=ra+(g*3>>2)-(sa[g-2]=="=")-(sa[g-1]=="=");for(;c<g;c+=4){d=b[sa.charCodeAt(c+1)];e=b[sa.charCodeAt(c+2)];qa[f++]=b[sa.charCodeAt(c)]<<2|d>>4;if(f<h)qa[f++]=d<<4|e>>2;if(f<h)qa[f++]=e<<6|b[sa.charCodeAt(c+3)]}}function ka(ta){ja(a,1024,"MDEyMzQ1Njc4OWFiY2RlZgBQbGFpbnRleHQgaGV4IGludmFsaWQARW5jcnlwdGlvbgBDaXBoZXJ0ZXh0IGhleCBpbnZhbGlkAERlY3J5cHRpb24ASW5wdXQgaGV4IGludmFsaWQAS2V5IGhleCBpbnZhbGlkAEtleQBJViBoZXggaW52YWxpZABJbml0ACFBRVMgZXJyb3I6IABMZW5ndGgASVYAQ2lwaGVyAE90aGVyADog");ja(a,1216,"Y3x3e/Jrb8UwAWcr/terdsqCyX36WUfwrdSir5ykcsC3/ZMmNj/3zDSl5fFx2DEVBMcjwxiWBZoHEoDi6yeydQmDLBobblqgUjvWsynjL4RT0QDtIPyxW2rLvjlKTFjP0O+q+0NNM4VF+QJ/UDyfqFGjQI+SnTj1vLbaIRD/89LNDBPsX5dEF8Snfj1kXRlzYIFP3CIqkIhG7rgU3l4L2+AyOgpJBiRcwtOsYpGV5HnnyDdtjdVOqWxW9Opleq4IunglLhymtMbo3XQfS72LinA+tWZIA/YOYTVXuYbBHZ7h+JgRadmOlJseh+nOVSjfjKGJDb/mQmhBmS0PsFS7FlIJatUwNqU4v0CjnoHz1/t84zmCmy//hzSOQ0TE3unLVHuUMqbCIz3uTJULQvrDTgguoWYo2SSydluiSW2L0SVy+PZkhmiYFtSkXMxdZbaSbHBIUP3tudpeFUZXp42dhJDYqwCMvNMK9+RYBbizRQbQLB6Pyj8PAsGvvQMBE4prOpERQU9n3OqX8s/O8LTmc5asdCLnrTWF4vk36Bx1325H8RpxHSnFiW+3Yg6qGL4b/FY+S8bSeSCa28D+eM1a9B/dqDOIB8cxsRIQWSeA7F9gUX+pGbVKDS3lep+TyZzvoOA7Ta4q9bDI67s8g1OZYRcrBH66d9Ym4WkUY1UhDH2NAQIECBAgQIAbNg==");ja(a,1740,"0AhQ")}function la(ua){var i=ua.memory;var j=i.buffer;var k=new Int8Array(j);var l=new Int16Array(j);var m=new Int32Array(j);var n=new Uint8Array(j);var o=new Uint16Array(j);var p=new Uint32Array(j);var q=new Float32Array(j);var r=new Float64Array(j);var s=Math.imul;var t=Math.fround;var u=Math.abs;var v=Math.clz32;var w=Math.min;var x=Math.max;var y=Math.floor;var z=Math.ceil;var A=Math.trunc;var B=Math.sqrt;var C=ua.abort;var D=NaN;var E=Infinity;var F=ua.emscripten_resize_heap;var G=ua.emscripten_memcpy_big;var H=5245136;
// EMSCRIPTEN_START_FUNCS
function $(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,o=0;o=H-16|0;H=o;a:{b:{c:{d:{e:{f:{g:{h:{i:{j:{k:{l:{if(a>>>0<=244){g=m[437];f=a>>>0<11?16:a+11&-8;a=f>>>3|0;b=g>>>a|0;if(b&3){c=a+((b^-1)&1)|0;f=c<<3;b=m[f+1796>>2];a=b+8|0;d=m[b+8>>2];f=f+1788|0;m:{if((d|0)==(f|0)){m[437]=ha(c)&g;break m}m[d+12>>2]=f;m[f+8>>2]=d}c=c<<3;m[b+4>>2]=c|3;b=b+c|0;m[b+4>>2]=m[b+4>>2]|1;break a}i=m[439];if(i>>>0>=f>>>0){break l}if(b){b=b<<a;a=2<<a;a=b&(0-a|a);a=(0-a&a)-1|0;b=a>>>12&16;c=b;a=a>>>b|0;b=a>>>5&8;c=c|b;a=a>>>b|0;b=a>>>2&4;c=c|b;a=a>>>b|0;b=a>>>1&2;c=c|b;a=a>>>b|0;b=a>>>1&1;c=(c|b)+(a>>>b|0)|0;d=c<<3;b=m[d+1796>>2];a=m[b+8>>2];d=d+1788|0;n:{if((a|0)==(d|0)){g=ha(c)&g;m[437]=g;break n}m[a+12>>2]=d;m[d+8>>2]=a}a=b+8|0;m[b+4>>2]=f|3;e=b+f|0;c=c<<3;f=c-f|0;m[e+4>>2]=f|1;m[b+c>>2]=f;if(i){c=i>>>3|0;b=(c<<3)+1788|0;d=m[442];c=1<<c;o:{if(!(c&g)){m[437]=c|g;c=b;break o}c=m[b+8>>2]}m[b+8>>2]=d;m[c+12>>2]=d;m[d+12>>2]=b;m[d+8>>2]=c}m[442]=e;m[439]=f;break a}k=m[438];if(!k){break l}a=(k&0-k)-1|0;b=a>>>12&16;c=b;a=a>>>b|0;b=a>>>5&8;c=c|b;a=a>>>b|0;b=a>>>2&4;c=c|b;a=a>>>b|0;b=a>>>1&2;c=c|b;a=a>>>b|0;b=a>>>1&1;b=m[((c|b)+(a>>>b|0)<<2)+2052>>2];e=(m[b+4>>2]&-8)-f|0;c=b;while(1){p:{a=m[c+16>>2];if(!a){a=m[c+20>>2];if(!a){break p}}d=(m[a+4>>2]&-8)-f|0;c=d>>>0<e>>>0;e=c?d:e;b=c?a:b;c=a;continue}break}l=b+f|0;if(l>>>0<=b>>>0){break k}j=m[b+24>>2];d=m[b+12>>2];if((d|0)!=(b|0)){a=m[b+8>>2];m[a+12>>2]=d;m[d+8>>2]=a;break b}c=b+20|0;a=m[c>>2];if(!a){a=m[b+16>>2];if(!a){break j}c=b+16|0}while(1){h=c;d=a;c=a+20|0;a=m[c>>2];if(a){continue}c=d+16|0;a=m[d+16>>2];if(a){continue}break}m[h>>2]=0;break b}f=-1;if(a>>>0>4294967231){break l}a=a+11|0;f=a&-8;i=m[438];if(!i){break l}h=31;e=0-f|0;if(f>>>0<=16777215){b=a>>>8|0;a=b+1048320>>>16&8;c=b<<a;b=c+520192>>>16&4;g=c<<b;c=g+245760>>>16&2;a=(g<<c>>>15|0)-(c|(a|b))|0;h=(a<<1|f>>>a+21&1)+28|0}c=m[(h<<2)+2052>>2];q:{r:{s:{if(!c){a=0;break s}a=0;b=f<<((h|0)==31?0:25-(h>>>1|0)|0);while(1){t:{g=(m[c+4>>2]&-8)-f|0;if(g>>>0>=e>>>0){break t}d=c;e=g;if(e){break t}e=0;a=c;break r}g=m[c+20>>2];c=m[((b>>>29&4)+c|0)+16>>2];a=g?(g|0)==(c|0)?a:g:a;b=b<<1;if(c){continue}break}}if(!(a|d)){a=2<<h;a=(0-a|a)&i;if(!a){break l}a=(a&0-a)-1|0;b=a>>>12&16;c=b;a=a>>>b|0;b=a>>>5&8;c=c|b;a=a>>>b|0;b=a>>>2&4;c=c|b;a=a>>>b|0;b=a>>>1&2;c=c|b;a=a>>>b|0;b=a>>>1&1;a=m[((c|b)+(a>>>b|0)<<2)+2052>>2]}if(!a){break q}}while(1){c=(m[a+4>>2]&-8)-f|0;b=c>>>0<e>>>0;e=b?c:e;d=b?a:d;b=m[a+16>>2];if(b){a=b}else{a=m[a+20>>2]}if(a){continue}break}}if(!d|m[439]-f>>>0<=e>>>0){break l}h=d+f|0;if(h>>>0<=d>>>0){break k}j=m[d+24>>2];b=m[d+12>>2];if((d|0)!=(b|0)){a=m[d+8>>2];m[a+12>>2]=b;m[b+8>>2]=a;break c}c=d+20|0;a=m[c>>2];if(!a){a=m[d+16>>2];if(!a){break i}c=d+16|0}while(1){g=c;b=a;c=a+20|0;a=m[c>>2];if(a){continue}c=b+16|0;a=m[b+16>>2];if(a){continue}break}m[g>>2]=0;break c}b=m[439];if(b>>>0>=f>>>0){a=m[442];c=b-f|0;u:{if(c>>>0>=16){m[439]=c;d=a+f|0;m[442]=d;m[d+4>>2]=c|1;m[a+b>>2]=c;m[a+4>>2]=f|3;break u}m[442]=0;m[439]=0;m[a+4>>2]=b|3;b=a+b|0;m[b+4>>2]=m[b+4>>2]|1}a=a+8|0;break a}d=m[440];if(d>>>0>f>>>0){b=d-f|0;m[440]=b;a=m[443];c=a+f|0;m[443]=c;m[c+4>>2]=b|1;m[a+4>>2]=f|3;a=a+8|0;break a}a=0;e=f+47|0;c=e;if(m[555]){b=m[557]}else{m[558]=-1;m[559]=-1;m[556]=4096;m[557]=4096;m[555]=o+12&-16^1431655768;m[560]=0;m[548]=0;b=4096}g=c+b|0;h=0-b|0;c=g&h;if(c>>>0<=f>>>0){break a}i=m[547];if(i){j=m[545];b=j+c|0;if(b>>>0<=j>>>0|b>>>0>i>>>0){break a}}if(n[2192]&4){break f}v:{w:{b=m[443];if(b){a=2196;while(1){i=m[a>>2];if(b>>>0<i+m[a+4>>2]>>>0?i>>>0<=b>>>0:0){break w}a=m[a+8>>2];if(a){continue}break}}b=ba(0);if((b|0)==-1){break g}g=c;a=m[556];d=a-1|0;if(d&b){g=(c-b|0)+(b+d&0-a)|0}if(g>>>0>2147483646|f>>>0>=g>>>0){break g}d=m[547];if(d){h=m[545];a=h+g|0;if(a>>>0<=h>>>0|a>>>0>d>>>0){break g}}a=ba(g);if((b|0)!=(a|0)){break v}break e}g=h&g-d;if(g>>>0>2147483646){break g}b=ba(g);if((b|0)==(m[a>>2]+m[a+4>>2]|0)){break h}a=b}if(!((a|0)==-1|f+48>>>0<=g>>>0)){b=m[557];b=b+(e-g|0)&0-b;if(b>>>0>2147483646){b=a;break e}if((ba(b)|0)!=-1){g=b+g|0;b=a;break e}ba(0-g|0);break g}b=a;if((a|0)!=-1){break e}break g}C()}d=0;break b}b=0;break c}if((b|0)!=-1){break e}}m[548]=m[548]|4}if(c>>>0>2147483646){break d}b=ba(c);a=ba(0);if(b>>>0>=a>>>0|(b|0)==-1|(a|0)==-1){break d}g=a-b|0;if(g>>>0<=f+40>>>0){break d}}a=m[545]+g|0;m[545]=a;if(a>>>0>p[546]){m[546]=a}x:{y:{z:{e=m[443];if(e){a=2196;while(1){c=m[a>>2];d=m[a+4>>2];if((c+d|0)==(b|0)){break z}a=m[a+8>>2];if(a){continue}break}break y}a=m[441];if(!(a>>>0<=b>>>0?a:0)){m[441]=b}a=0;m[550]=g;m[549]=b;m[445]=-1;m[446]=m[555];m[552]=0;while(1){c=a<<3;d=c+1788|0;m[c+1796>>2]=d;m[c+1800>>2]=d;a=a+1|0;if((a|0)!=32){continue}break}a=g-40|0;c=b+8&7?-8-b&7:0;d=a-c|0;m[440]=d;c=b+c|0;m[443]=c;m[c+4>>2]=d|1;m[(a+b|0)+4>>2]=40;m[444]=m[559];break x}if(m[a+12>>2]&8|(b>>>0<=e>>>0|c>>>0>e>>>0)){break y}m[a+4>>2]=d+g;a=e+8&7?-8-e&7:0;b=a+e|0;m[443]=b;c=m[440]+g|0;a=c-a|0;m[440]=a;m[b+4>>2]=a|1;m[(c+e|0)+4>>2]=40;m[444]=m[559];break x}d=m[441];if(d>>>0>b>>>0){m[441]=b;d=0}c=b+g|0;a=2196;A:{B:{C:{D:{E:{F:{while(1){if((c|0)!=m[a>>2]){a=m[a+8>>2];if(a){continue}break F}break}if(!(n[a+12|0]&8)){break E}}a=2196;while(1){c=m[a>>2];if(c>>>0<=e>>>0){d=c+m[a+4>>2]|0;if(d>>>0>e>>>0){break D}}a=m[a+8>>2];continue}}m[a>>2]=b;m[a+4>>2]=m[a+4>>2]+g;j=(b+8&7?-8-b&7:0)+b|0;m[j+4>>2]=f|3;b=c+(c+8&7?-8-c&7:0)|0;a=(b-j|0)-f|0;h=f+j|0;if((b|0)==(e|0)){m[443]=h;a=m[440]+a|0;m[440]=a;m[h+4>>2]=a|1;break B}if(m[442]==(b|0)){m[442]=h;a=m[439]+a|0;m[439]=a;m[h+4>>2]=a|1;m[a+h>>2]=a;break B}c=m[b+4>>2];if((c&3)==1){k=c&-8;G:{if(c>>>0<=255){f=c>>>3|0;c=m[b+8>>2];d=m[b+12>>2];if((d|0)==(c|0)){m[437]=m[437]&ha(f);break G}m[c+12>>2]=d;m[d+8>>2]=c;break G}i=m[b+24>>2];g=m[b+12>>2];H:{if((g|0)!=(b|0)){c=m[b+8>>2];m[c+12>>2]=g;m[g+8>>2]=c;break H}I:{e=b+20|0;f=m[e>>2];if(f){break I}e=b+16|0;f=m[e>>2];if(f){break I}g=0;break H}while(1){c=e;g=f;e=f+20|0;f=m[e>>2];if(f){continue}e=g+16|0;f=m[g+16>>2];if(f){continue}break}m[c>>2]=0}if(!i){break G}c=m[b+28>>2];d=(c<<2)+2052|0;J:{if(m[d>>2]==(b|0)){m[d>>2]=g;if(g){break J}m[438]=m[438]&ha(c);break G}m[i+(m[i+16>>2]==(b|0)?16:20)>>2]=g;if(!g){break G}}m[g+24>>2]=i;c=m[b+16>>2];if(c){m[g+16>>2]=c;m[c+24>>2]=g}c=m[b+20>>2];if(!c){break G}m[g+20>>2]=c;m[c+24>>2]=g}b=b+k|0;a=a+k|0}m[b+4>>2]=m[b+4>>2]&-2;m[h+4>>2]=a|1;m[a+h>>2]=a;if(a>>>0<=255){b=a>>>3|0;a=(b<<3)+1788|0;c=m[437];b=1<<b;K:{if(!(c&b)){m[437]=b|c;b=a;break K}b=m[a+8>>2]}m[a+8>>2]=h;m[b+12>>2]=h;m[h+12>>2]=a;m[h+8>>2]=b;break B}e=31;if(a>>>0<=16777215){c=a>>>8|0;b=c+1048320>>>16&8;d=c<<b;c=d+520192>>>16&4;f=d<<c;d=f+245760>>>16&2;b=(f<<d>>>15|0)-(d|(b|c))|0;e=(b<<1|a>>>b+21&1)+28|0}m[h+28>>2]=e;m[h+16>>2]=0;m[h+20>>2]=0;b=(e<<2)+2052|0;c=m[438];d=1<<e;L:{if(!(c&d)){m[438]=c|d;m[b>>2]=h;m[h+24>>2]=b;break L}e=a<<((e|0)==31?0:25-(e>>>1|0)|0);b=m[b>>2];while(1){c=b;if((m[b+4>>2]&-8)==(a|0)){break C}b=e>>>29|0;e=e<<1;d=(c+(b&4)|0)+16|0;b=m[d>>2];if(b){continue}break}m[d>>2]=h;m[h+24>>2]=c}m[h+12>>2]=h;m[h+8>>2]=h;break B}a=g-40|0;c=b+8&7?-8-b&7:0;h=a-c|0;m[440]=h;c=b+c|0;m[443]=c;m[c+4>>2]=h|1;m[(a+b|0)+4>>2]=40;m[444]=m[559];a=(d+(d-39&7?39-d&7:0)|0)-47|0;c=a>>>0<e+16>>>0?e:a;m[c+4>>2]=27;a=m[552];m[c+16>>2]=m[551];m[c+20>>2]=a;a=m[550];m[c+8>>2]=m[549];m[c+12>>2]=a;m[551]=c+8;m[550]=g;m[549]=b;m[552]=0;a=c+24|0;while(1){m[a+4>>2]=7;b=a+8|0;a=a+4|0;if(b>>>0<d>>>0){continue}break}if((c|0)==(e|0)){break x}m[c+4>>2]=m[c+4>>2]&-2;d=c-e|0;m[e+4>>2]=d|1;m[c>>2]=d;if(d>>>0<=255){b=d>>>3|0;a=(b<<3)+1788|0;c=m[437];b=1<<b;M:{if(!(c&b)){m[437]=b|c;b=a;break M}b=m[a+8>>2]}m[a+8>>2]=e;m[b+12>>2]=e;m[e+12>>2]=a;m[e+8>>2]=b;break x}a=31;m[e+16>>2]=0;m[e+20>>2]=0;if(d>>>0<=16777215){b=d>>>8|0;a=b+1048320>>>16&8;c=b<<a;b=c+520192>>>16&4;g=c<<b;c=g+245760>>>16&2;a=(g<<c>>>15|0)-(c|(a|b))|0;a=(a<<1|d>>>a+21&1)+28|0}m[e+28>>2]=a;b=(a<<2)+2052|0;c=m[438];g=1<<a;N:{if(!(c&g)){m[438]=c|g;m[b>>2]=e;m[e+24>>2]=b;break N}a=d<<((a|0)==31?0:25-(a>>>1|0)|0);b=m[b>>2];while(1){c=b;if((d|0)==(m[b+4>>2]&-8)){break A}b=a>>>29|0;a=a<<1;g=(c+(b&4)|0)+16|0;b=m[g>>2];if(b){continue}break}m[g>>2]=e;m[e+24>>2]=c}m[e+12>>2]=e;m[e+8>>2]=e;break x}a=m[c+8>>2];m[a+12>>2]=h;m[c+8>>2]=h;m[h+24>>2]=0;m[h+12>>2]=c;m[h+8>>2]=a}a=j+8|0;break a}a=m[c+8>>2];m[a+12>>2]=e;m[c+8>>2]=e;m[e+24>>2]=0;m[e+12>>2]=c;m[e+8>>2]=a}a=m[440];if(a>>>0<=f>>>0){break d}b=a-f|0;m[440]=b;a=m[443];c=a+f|0;m[443]=c;m[c+4>>2]=b|1;m[a+4>>2]=f|3;a=a+8|0;break a}m[436]=48;a=0;break a}O:{if(!j){break O}a=m[d+28>>2];c=(a<<2)+2052|0;P:{if(m[c>>2]==(d|0)){m[c>>2]=b;if(b){break P}i=ha(a)&i;m[438]=i;break O}m[j+(m[j+16>>2]==(d|0)?16:20)>>2]=b;if(!b){break O}}m[b+24>>2]=j;a=m[d+16>>2];if(a){m[b+16>>2]=a;m[a+24>>2]=b}a=m[d+20>>2];if(!a){break O}m[b+20>>2]=a;m[a+24>>2]=b}Q:{if(e>>>0<=15){a=e+f|0;m[d+4>>2]=a|3;a=a+d|0;m[a+4>>2]=m[a+4>>2]|1;break Q}m[d+4>>2]=f|3;m[h+4>>2]=e|1;m[e+h>>2]=e;if(e>>>0<=255){b=e>>>3|0;a=(b<<3)+1788|0;c=m[437];b=1<<b;R:{if(!(c&b)){m[437]=b|c;b=a;break R}b=m[a+8>>2]}m[a+8>>2]=h;m[b+12>>2]=h;m[h+12>>2]=a;m[h+8>>2]=b;break Q}a=31;if(e>>>0<=16777215){b=e>>>8|0;a=b+1048320>>>16&8;c=b<<a;b=c+520192>>>16&4;f=c<<b;c=f+245760>>>16&2;a=(f<<c>>>15|0)-(c|(a|b))|0;a=(a<<1|e>>>a+21&1)+28|0}m[h+28>>2]=a;m[h+16>>2]=0;m[h+20>>2]=0;b=(a<<2)+2052|0;S:{c=1<<a;T:{if(!(c&i)){m[438]=c|i;m[b>>2]=h;break T}a=e<<((a|0)==31?0:25-(a>>>1|0)|0);f=m[b>>2];while(1){b=f;if((m[b+4>>2]&-8)==(e|0)){break S}c=a>>>29|0;a=a<<1;c=(b+(c&4)|0)+16|0;f=m[c>>2];if(f){continue}break}m[c>>2]=h}m[h+24>>2]=b;m[h+12>>2]=h;m[h+8>>2]=h;break Q}a=m[b+8>>2];m[a+12>>2]=h;m[b+8>>2]=h;m[h+24>>2]=0;m[h+12>>2]=b;m[h+8>>2]=a}a=d+8|0;break a}U:{if(!j){break U}a=m[b+28>>2];c=(a<<2)+2052|0;V:{if(m[c>>2]==(b|0)){m[c>>2]=d;if(d){break V}m[438]=ha(a)&k;break U}m[(m[j+16>>2]==(b|0)?16:20)+j>>2]=d;if(!d){break U}}m[d+24>>2]=j;a=m[b+16>>2];if(a){m[d+16>>2]=a;m[a+24>>2]=d}a=m[b+20>>2];if(!a){break U}m[d+20>>2]=a;m[a+24>>2]=d}W:{if(e>>>0<=15){a=e+f|0;m[b+4>>2]=a|3;a=a+b|0;m[a+4>>2]=m[a+4>>2]|1;break W}m[b+4>>2]=f|3;m[l+4>>2]=e|1;m[e+l>>2]=e;if(i){c=i>>>3|0;a=(c<<3)+1788|0;d=m[442];c=1<<c;X:{if(!(c&g)){m[437]=c|g;c=a;break X}c=m[a+8>>2]}m[a+8>>2]=d;m[c+12>>2]=d;m[d+12>>2]=a;m[d+8>>2]=c}m[442]=l;m[439]=e}a=b+8|0}H=o+16|0;return a|0}function N(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;e=H-320|0;H=e;g=da(d);f=K(b);a:{if(!f){b=$(47);a=n[1175]|n[1176]<<8|(n[1177]<<16|n[1178]<<24);c=n[1171]|n[1172]<<8|(n[1173]<<16|n[1174]<<24);k[b+5|0]=c;k[b+6|0]=c>>>8;k[b+7|0]=c>>>16;k[b+8|0]=c>>>24;k[b+9|0]=a;k[b+10|0]=a>>>8;k[b+11|0]=a>>>16;k[b+12|0]=a>>>24;a=n[1170]|n[1171]<<8|(n[1172]<<16|n[1173]<<24);c=n[1166]|n[1167]<<8|(n[1168]<<16|n[1169]<<24);k[b|0]=c;k[b+1|0]=c>>>8;k[b+2|0]=c>>>16;k[b+3|0]=c>>>24;k[b+4|0]=a;k[b+5|0]=a>>>8;k[b+6|0]=a>>>16;k[b+7|0]=a>>>24;a=da(b)+b|0;c=n[1196]|n[1197]<<8|(n[1198]<<16|n[1199]<<24);k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=c>>>16;k[a+3|0]=c>>>24;c=n[1200]|n[1201]<<8;k[a+4|0]=c;k[a+5|0]=c>>>8;a=da(b)+b|0;c=n[1202]|n[1203]<<8;k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=n[1204];a=da(b)+b|0;c=n[1130]|n[1131]<<8|(n[1132]<<16|n[1133]<<24);d=n[1126]|n[1127]<<8|(n[1128]<<16|n[1129]<<24);k[a|0]=d;k[a+1|0]=d>>>8;k[a+2|0]=d>>>16;k[a+3|0]=d>>>24;k[a+4|0]=c;k[a+5|0]=c>>>8;k[a+6|0]=c>>>16;k[a+7|0]=c>>>24;c=n[1138]|n[1139]<<8|(n[1140]<<16|n[1141]<<24);d=n[1134]|n[1135]<<8|(n[1136]<<16|n[1137]<<24);k[a+8|0]=d;k[a+9|0]=d>>>8;k[a+10|0]=d>>>16;k[a+11|0]=d>>>24;k[a+12|0]=c;k[a+13|0]=c>>>8;k[a+14|0]=c>>>16;k[a+15|0]=c>>>24;break a}b=U(e+72|0,da(b)<<2,f);aa(f);if(b){b=M(b,1142);if(b){break a}}b=K(c);if(!b){b=$(46);a=n[1175]|n[1176]<<8|(n[1177]<<16|n[1178]<<24);c=n[1171]|n[1172]<<8|(n[1173]<<16|n[1174]<<24);k[b+5|0]=c;k[b+6|0]=c>>>8;k[b+7|0]=c>>>16;k[b+8|0]=c>>>24;k[b+9|0]=a;k[b+10|0]=a>>>8;k[b+11|0]=a>>>16;k[b+12|0]=a>>>24;a=n[1170]|n[1171]<<8|(n[1172]<<16|n[1173]<<24);c=n[1166]|n[1167]<<8|(n[1168]<<16|n[1169]<<24);k[b|0]=c;k[b+1|0]=c>>>8;k[b+2|0]=c>>>16;k[b+3|0]=c>>>24;k[b+4|0]=a;k[b+5|0]=a>>>8;k[b+6|0]=a>>>16;k[b+7|0]=a>>>24;a=da(b)+b|0;c=n[1196]|n[1197]<<8|(n[1198]<<16|n[1199]<<24);k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=c>>>16;k[a+3|0]=c>>>24;c=n[1200]|n[1201]<<8;k[a+4|0]=c;k[a+5|0]=c>>>8;a=da(b)+b|0;c=n[1202]|n[1203]<<8;k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=n[1204];a=da(b)+b|0;c=n[1150]|n[1151]<<8|(n[1152]<<16|n[1153]<<24);d=n[1146]|n[1147]<<8|(n[1148]<<16|n[1149]<<24);k[a|0]=d;k[a+1|0]=d>>>8;k[a+2|0]=d>>>16;k[a+3|0]=d>>>24;k[a+4|0]=c;k[a+5|0]=c>>>8;k[a+6|0]=c>>>16;k[a+7|0]=c>>>24;c=n[1157]|n[1158]<<8|(n[1159]<<16|n[1160]<<24);d=n[1153]|n[1154]<<8|(n[1155]<<16|n[1156]<<24);k[a+7|0]=d;k[a+8|0]=d>>>8;k[a+9|0]=d>>>16;k[a+10|0]=d>>>24;k[a+11|0]=c;k[a+12|0]=c>>>8;k[a+13|0]=c>>>16;k[a+14|0]=c>>>24;break a}a=V(e+8|0,a,e+72|0,b);aa(b);if(a){b=M(a,1161);if(b){break a}}a=K(d);if(!a){b=$(54);a=n[1175]|n[1176]<<8|(n[1177]<<16|n[1178]<<24);c=n[1171]|n[1172]<<8|(n[1173]<<16|n[1174]<<24);k[b+5|0]=c;k[b+6|0]=c>>>8;k[b+7|0]=c>>>16;k[b+8|0]=c>>>24;k[b+9|0]=a;k[b+10|0]=a>>>8;k[b+11|0]=a>>>16;k[b+12|0]=a>>>24;a=n[1170]|n[1171]<<8|(n[1172]<<16|n[1173]<<24);c=n[1166]|n[1167]<<8|(n[1168]<<16|n[1169]<<24);k[b|0]=c;k[b+1|0]=c>>>8;k[b+2|0]=c>>>16;k[b+3|0]=c>>>24;k[b+4|0]=a;k[b+5|0]=a>>>8;k[b+6|0]=a>>>16;k[b+7|0]=a>>>24;a=da(b)+b|0;c=n[1196]|n[1197]<<8|(n[1198]<<16|n[1199]<<24);k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=c>>>16;k[a+3|0]=c>>>24;c=n[1200]|n[1201]<<8;k[a+4|0]=c;k[a+5|0]=c>>>8;a=da(b)+b|0;c=n[1202]|n[1203]<<8;k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=n[1204];a=da(b)+b|0;c=n[1078]|n[1079]<<8|(n[1080]<<16|n[1081]<<24);d=n[1074]|n[1075]<<8|(n[1076]<<16|n[1077]<<24);k[a|0]=d;k[a+1|0]=d>>>8;k[a+2|0]=d>>>16;k[a+3|0]=d>>>24;k[a+4|0]=c;k[a+5|0]=c>>>8;k[a+6|0]=c>>>16;k[a+7|0]=c>>>24;c=n[1093]|n[1094]<<8|(n[1095]<<16|n[1096]<<24);d=n[1089]|n[1090]<<8|(n[1091]<<16|n[1092]<<24);k[a+15|0]=d;k[a+16|0]=d>>>8;k[a+17|0]=d>>>16;k[a+18|0]=d>>>24;k[a+19|0]=c;k[a+20|0]=c>>>8;k[a+21|0]=c>>>16;k[a+22|0]=c>>>24;c=n[1086]|n[1087]<<8|(n[1088]<<16|n[1089]<<24);d=n[1082]|n[1083]<<8|(n[1084]<<16|n[1085]<<24);k[a+8|0]=d;k[a+9|0]=d>>>8;k[a+10|0]=d>>>16;k[a+11|0]=d>>>24;k[a+12|0]=c;k[a+13|0]=c>>>8;k[a+14|0]=c>>>16;k[a+15|0]=c>>>24;break a}d=g>>>1|0;b=Y(e+8|0,a,a,d);if(b){aa(a);b=M(b,1097);break a}b=$(g|1);if(d){c=0;while(1){f=c<<1;h=n[a+c|0];k[f+b|0]=n[(h>>>4|0)+1024|0];k[(f|1)+b|0]=n[(h&15)+1024|0];c=c+1|0;if((d|0)!=(c|0)){continue}break}}k[(g&-2)+b|0]=0;aa(a)}H=e+320|0;return b|0}function L(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;e=H-320|0;H=e;g=da(d);f=K(b);a:{if(!f){b=$(47);a=n[1175]|n[1176]<<8|(n[1177]<<16|n[1178]<<24);c=n[1171]|n[1172]<<8|(n[1173]<<16|n[1174]<<24);k[b+5|0]=c;k[b+6|0]=c>>>8;k[b+7|0]=c>>>16;k[b+8|0]=c>>>24;k[b+9|0]=a;k[b+10|0]=a>>>8;k[b+11|0]=a>>>16;k[b+12|0]=a>>>24;a=n[1170]|n[1171]<<8|(n[1172]<<16|n[1173]<<24);c=n[1166]|n[1167]<<8|(n[1168]<<16|n[1169]<<24);k[b|0]=c;k[b+1|0]=c>>>8;k[b+2|0]=c>>>16;k[b+3|0]=c>>>24;k[b+4|0]=a;k[b+5|0]=a>>>8;k[b+6|0]=a>>>16;k[b+7|0]=a>>>24;a=da(b)+b|0;c=n[1196]|n[1197]<<8|(n[1198]<<16|n[1199]<<24);k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=c>>>16;k[a+3|0]=c>>>24;c=n[1200]|n[1201]<<8;k[a+4|0]=c;k[a+5|0]=c>>>8;a=da(b)+b|0;c=n[1202]|n[1203]<<8;k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=n[1204];a=da(b)+b|0;c=n[1130]|n[1131]<<8|(n[1132]<<16|n[1133]<<24);d=n[1126]|n[1127]<<8|(n[1128]<<16|n[1129]<<24);k[a|0]=d;k[a+1|0]=d>>>8;k[a+2|0]=d>>>16;k[a+3|0]=d>>>24;k[a+4|0]=c;k[a+5|0]=c>>>8;k[a+6|0]=c>>>16;k[a+7|0]=c>>>24;c=n[1138]|n[1139]<<8|(n[1140]<<16|n[1141]<<24);d=n[1134]|n[1135]<<8|(n[1136]<<16|n[1137]<<24);k[a+8|0]=d;k[a+9|0]=d>>>8;k[a+10|0]=d>>>16;k[a+11|0]=d>>>24;k[a+12|0]=c;k[a+13|0]=c>>>8;k[a+14|0]=c>>>16;k[a+15|0]=c>>>24;break a}b=U(e+72|0,da(b)<<2,f);aa(f);if(b){b=M(b,1142);if(b){break a}}b=K(c);if(!b){b=$(46);a=n[1175]|n[1176]<<8|(n[1177]<<16|n[1178]<<24);c=n[1171]|n[1172]<<8|(n[1173]<<16|n[1174]<<24);k[b+5|0]=c;k[b+6|0]=c>>>8;k[b+7|0]=c>>>16;k[b+8|0]=c>>>24;k[b+9|0]=a;k[b+10|0]=a>>>8;k[b+11|0]=a>>>16;k[b+12|0]=a>>>24;a=n[1170]|n[1171]<<8|(n[1172]<<16|n[1173]<<24);c=n[1166]|n[1167]<<8|(n[1168]<<16|n[1169]<<24);k[b|0]=c;k[b+1|0]=c>>>8;k[b+2|0]=c>>>16;k[b+3|0]=c>>>24;k[b+4|0]=a;k[b+5|0]=a>>>8;k[b+6|0]=a>>>16;k[b+7|0]=a>>>24;a=da(b)+b|0;c=n[1196]|n[1197]<<8|(n[1198]<<16|n[1199]<<24);k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=c>>>16;k[a+3|0]=c>>>24;c=n[1200]|n[1201]<<8;k[a+4|0]=c;k[a+5|0]=c>>>8;a=da(b)+b|0;c=n[1202]|n[1203]<<8;k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=n[1204];a=da(b)+b|0;c=n[1150]|n[1151]<<8|(n[1152]<<16|n[1153]<<24);d=n[1146]|n[1147]<<8|(n[1148]<<16|n[1149]<<24);k[a|0]=d;k[a+1|0]=d>>>8;k[a+2|0]=d>>>16;k[a+3|0]=d>>>24;k[a+4|0]=c;k[a+5|0]=c>>>8;k[a+6|0]=c>>>16;k[a+7|0]=c>>>24;c=n[1157]|n[1158]<<8|(n[1159]<<16|n[1160]<<24);d=n[1153]|n[1154]<<8|(n[1155]<<16|n[1156]<<24);k[a+7|0]=d;k[a+8|0]=d>>>8;k[a+9|0]=d>>>16;k[a+10|0]=d>>>24;k[a+11|0]=c;k[a+12|0]=c>>>8;k[a+13|0]=c>>>16;k[a+14|0]=c>>>24;break a}a=V(e+8|0,a,e+72|0,b);aa(b);if(a){b=M(a,1161);if(b){break a}}a=K(d);if(!a){b=$(53);a=n[1175]|n[1176]<<8|(n[1177]<<16|n[1178]<<24);c=n[1171]|n[1172]<<8|(n[1173]<<16|n[1174]<<24);k[b+5|0]=c;k[b+6|0]=c>>>8;k[b+7|0]=c>>>16;k[b+8|0]=c>>>24;k[b+9|0]=a;k[b+10|0]=a>>>8;k[b+11|0]=a>>>16;k[b+12|0]=a>>>24;a=n[1170]|n[1171]<<8|(n[1172]<<16|n[1173]<<24);c=n[1166]|n[1167]<<8|(n[1168]<<16|n[1169]<<24);k[b|0]=c;k[b+1|0]=c>>>8;k[b+2|0]=c>>>16;k[b+3|0]=c>>>24;k[b+4|0]=a;k[b+5|0]=a>>>8;k[b+6|0]=a>>>16;k[b+7|0]=a>>>24;a=da(b)+b|0;c=n[1196]|n[1197]<<8|(n[1198]<<16|n[1199]<<24);k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=c>>>16;k[a+3|0]=c>>>24;c=n[1200]|n[1201]<<8;k[a+4|0]=c;k[a+5|0]=c>>>8;a=da(b)+b|0;c=n[1202]|n[1203]<<8;k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=n[1204];a=da(b)+b|0;c=n[1045]|n[1046]<<8|(n[1047]<<16|n[1048]<<24);d=n[1041]|n[1042]<<8|(n[1043]<<16|n[1044]<<24);k[a|0]=d;k[a+1|0]=d>>>8;k[a+2|0]=d>>>16;k[a+3|0]=d>>>24;k[a+4|0]=c;k[a+5|0]=c>>>8;k[a+6|0]=c>>>16;k[a+7|0]=c>>>24;c=n[1059]|n[1060]<<8|(n[1061]<<16|n[1062]<<24);d=n[1055]|n[1056]<<8|(n[1057]<<16|n[1058]<<24);k[a+14|0]=d;k[a+15|0]=d>>>8;k[a+16|0]=d>>>16;k[a+17|0]=d>>>24;k[a+18|0]=c;k[a+19|0]=c>>>8;k[a+20|0]=c>>>16;k[a+21|0]=c>>>24;c=n[1053]|n[1054]<<8|(n[1055]<<16|n[1056]<<24);d=n[1049]|n[1050]<<8|(n[1051]<<16|n[1052]<<24);k[a+8|0]=d;k[a+9|0]=d>>>8;k[a+10|0]=d>>>16;k[a+11|0]=d>>>24;k[a+12|0]=c;k[a+13|0]=c>>>8;k[a+14|0]=c>>>16;k[a+15|0]=c>>>24;break a}d=g>>>1|0;b=W(e+8|0,a,a,d);if(b){aa(a);b=M(b,1063);break a}b=$(g|1);if(d){c=0;while(1){f=c<<1;h=n[a+c|0];k[f+b|0]=n[(h>>>4|0)+1024|0];k[(f|1)+b|0]=n[(h&15)+1024|0];c=c+1|0;if((d|0)!=(c|0)){continue}break}}k[(g&-2)+b|0]=0;aa(a)}H=e+320|0;return b|0}function aa(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0;a:{if(!a){break a}d=a-8|0;b=m[a-4>>2];a=b&-8;f=d+a|0;b:{if(b&1){break b}if(!(b&3)){break a}b=m[d>>2];d=d-b|0;if(d>>>0<p[441]){break a}a=a+b|0;if(m[442]!=(d|0)){if(b>>>0<=255){e=m[d+8>>2];b=b>>>3|0;c=m[d+12>>2];if((c|0)==(e|0)){m[437]=m[437]&ha(b);break b}m[e+12>>2]=c;m[c+8>>2]=e;break b}h=m[d+24>>2];b=m[d+12>>2];c:{if((b|0)!=(d|0)){c=m[d+8>>2];m[c+12>>2]=b;m[b+8>>2]=c;break c}d:{e=d+20|0;c=m[e>>2];if(c){break d}e=d+16|0;c=m[e>>2];if(c){break d}b=0;break c}while(1){g=e;b=c;e=b+20|0;c=m[e>>2];if(c){continue}e=b+16|0;c=m[b+16>>2];if(c){continue}break}m[g>>2]=0}if(!h){break b}e=m[d+28>>2];c=(e<<2)+2052|0;e:{if(m[c>>2]==(d|0)){m[c>>2]=b;if(b){break e}m[438]=m[438]&ha(e);break b}m[h+(m[h+16>>2]==(d|0)?16:20)>>2]=b;if(!b){break b}}m[b+24>>2]=h;c=m[d+16>>2];if(c){m[b+16>>2]=c;m[c+24>>2]=b}c=m[d+20>>2];if(!c){break b}m[b+20>>2]=c;m[c+24>>2]=b;break b}b=m[f+4>>2];if((b&3)!=3){break b}m[439]=a;m[f+4>>2]=b&-2;m[d+4>>2]=a|1;m[a+d>>2]=a;return}if(d>>>0>=f>>>0){break a}b=m[f+4>>2];if(!(b&1)){break a}f:{if(!(b&2)){if((f|0)==m[443]){m[443]=d;a=m[440]+a|0;m[440]=a;m[d+4>>2]=a|1;if(m[442]!=(d|0)){break a}m[439]=0;m[442]=0;return}if((f|0)==m[442]){m[442]=d;a=m[439]+a|0;m[439]=a;m[d+4>>2]=a|1;m[a+d>>2]=a;return}a=(b&-8)+a|0;g:{if(b>>>0<=255){c=m[f+8>>2];b=b>>>3|0;e=m[f+12>>2];if((c|0)==(e|0)){m[437]=m[437]&ha(b);break g}m[c+12>>2]=e;m[e+8>>2]=c;break g}h=m[f+24>>2];b=m[f+12>>2];h:{if((f|0)!=(b|0)){c=m[f+8>>2];m[c+12>>2]=b;m[b+8>>2]=c;break h}i:{e=f+20|0;c=m[e>>2];if(c){break i}e=f+16|0;c=m[e>>2];if(c){break i}b=0;break h}while(1){g=e;b=c;e=b+20|0;c=m[e>>2];if(c){continue}e=b+16|0;c=m[b+16>>2];if(c){continue}break}m[g>>2]=0}if(!h){break g}e=m[f+28>>2];c=(e<<2)+2052|0;j:{if((f|0)==m[c>>2]){m[c>>2]=b;if(b){break j}m[438]=m[438]&ha(e);break g}m[h+((f|0)==m[h+16>>2]?16:20)>>2]=b;if(!b){break g}}m[b+24>>2]=h;c=m[f+16>>2];if(c){m[b+16>>2]=c;m[c+24>>2]=b}c=m[f+20>>2];if(!c){break g}m[b+20>>2]=c;m[c+24>>2]=b}m[d+4>>2]=a|1;m[a+d>>2]=a;if(m[442]!=(d|0)){break f}m[439]=a;return}m[f+4>>2]=b&-2;m[d+4>>2]=a|1;m[a+d>>2]=a}if(a>>>0<=255){a=a>>>3|0;b=(a<<3)+1788|0;c=m[437];a=1<<a;k:{if(!(c&a)){m[437]=a|c;a=b;break k}a=m[b+8>>2]}m[b+8>>2]=d;m[a+12>>2]=d;m[d+12>>2]=b;m[d+8>>2]=a;return}e=31;m[d+16>>2]=0;m[d+20>>2]=0;if(a>>>0<=16777215){b=a>>>8|0;g=b+1048320>>>16&8;b=b<<g;e=b+520192>>>16&4;b=b<<e;c=b+245760>>>16&2;b=(b<<c>>>15|0)-(c|(e|g))|0;e=(b<<1|a>>>b+21&1)+28|0}m[d+28>>2]=e;g=(e<<2)+2052|0;l:{m:{c=m[438];b=1<<e;n:{if(!(c&b)){m[438]=b|c;m[g>>2]=d;m[d+24>>2]=g;break n}e=a<<((e|0)==31?0:25-(e>>>1|0)|0);b=m[g>>2];while(1){c=b;if((m[b+4>>2]&-8)==(a|0)){break m}b=e>>>29|0;e=e<<1;g=(c+(b&4)|0)+16|0;b=m[g>>2];if(b){continue}break}m[g>>2]=d;m[d+24>>2]=c}m[d+12>>2]=d;m[d+8>>2]=d;break l}a=m[c+8>>2];m[a+12>>2]=d;m[c+8>>2]=d;m[d+24>>2]=0;m[d+12>>2]=c;m[d+8>>2]=a}a=m[445]-1|0;m[445]=a;if(a){break a}d=2204;while(1){a=m[d>>2];d=a+8|0;if(a){continue}break}m[445]=-1}}function O(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;e=H-272|0;H=e;d=da(b);c=K(a);a:{if(!c){c=$(47);a=n[1175]|n[1176]<<8|(n[1177]<<16|n[1178]<<24);b=n[1171]|n[1172]<<8|(n[1173]<<16|n[1174]<<24);k[c+5|0]=b;k[c+6|0]=b>>>8;k[c+7|0]=b>>>16;k[c+8|0]=b>>>24;k[c+9|0]=a;k[c+10|0]=a>>>8;k[c+11|0]=a>>>16;k[c+12|0]=a>>>24;a=n[1170]|n[1171]<<8|(n[1172]<<16|n[1173]<<24);b=n[1166]|n[1167]<<8|(n[1168]<<16|n[1169]<<24);k[c|0]=b;k[c+1|0]=b>>>8;k[c+2|0]=b>>>16;k[c+3|0]=b>>>24;k[c+4|0]=a;k[c+5|0]=a>>>8;k[c+6|0]=a>>>16;k[c+7|0]=a>>>24;a=da(c)+c|0;b=n[1196]|n[1197]<<8|(n[1198]<<16|n[1199]<<24);k[a|0]=b;k[a+1|0]=b>>>8;k[a+2|0]=b>>>16;k[a+3|0]=b>>>24;b=n[1200]|n[1201]<<8;k[a+4|0]=b;k[a+5|0]=b>>>8;a=da(c)+c|0;b=n[1202]|n[1203]<<8;k[a|0]=b;k[a+1|0]=b>>>8;k[a+2|0]=n[1204];a=da(c)+c|0;b=n[1130]|n[1131]<<8|(n[1132]<<16|n[1133]<<24);d=n[1126]|n[1127]<<8|(n[1128]<<16|n[1129]<<24);k[a|0]=d;k[a+1|0]=d>>>8;k[a+2|0]=d>>>16;k[a+3|0]=d>>>24;k[a+4|0]=b;k[a+5|0]=b>>>8;k[a+6|0]=b>>>16;k[a+7|0]=b>>>24;b=n[1138]|n[1139]<<8|(n[1140]<<16|n[1141]<<24);d=n[1134]|n[1135]<<8|(n[1136]<<16|n[1137]<<24);k[a+8|0]=d;k[a+9|0]=d>>>8;k[a+10|0]=d>>>16;k[a+11|0]=d>>>24;k[a+12|0]=b;k[a+13|0]=b>>>8;k[a+14|0]=b>>>16;k[a+15|0]=b>>>24;break a}a=U(e+24|0,da(a)<<2,c);aa(c);if(a){c=M(a,1142);if(c){break a}}a=K(b);if(!a){c=$(49);a=n[1175]|n[1176]<<8|(n[1177]<<16|n[1178]<<24);b=n[1171]|n[1172]<<8|(n[1173]<<16|n[1174]<<24);k[c+5|0]=b;k[c+6|0]=b>>>8;k[c+7|0]=b>>>16;k[c+8|0]=b>>>24;k[c+9|0]=a;k[c+10|0]=a>>>8;k[c+11|0]=a>>>16;k[c+12|0]=a>>>24;a=n[1170]|n[1171]<<8|(n[1172]<<16|n[1173]<<24);b=n[1166]|n[1167]<<8|(n[1168]<<16|n[1169]<<24);k[c|0]=b;k[c+1|0]=b>>>8;k[c+2|0]=b>>>16;k[c+3|0]=b>>>24;k[c+4|0]=a;k[c+5|0]=a>>>8;k[c+6|0]=a>>>16;k[c+7|0]=a>>>24;a=da(c)+c|0;b=n[1196]|n[1197]<<8|(n[1198]<<16|n[1199]<<24);k[a|0]=b;k[a+1|0]=b>>>8;k[a+2|0]=b>>>16;k[a+3|0]=b>>>24;b=n[1200]|n[1201]<<8;k[a+4|0]=b;k[a+5|0]=b>>>8;a=da(c)+c|0;b=n[1202]|n[1203]<<8;k[a|0]=b;k[a+1|0]=b>>>8;k[a+2|0]=n[1204];a=da(c)+c|0;b=n[1112]|n[1113]<<8|(n[1114]<<16|n[1115]<<24);d=n[1108]|n[1109]<<8|(n[1110]<<16|n[1111]<<24);k[a|0]=d;k[a+1|0]=d>>>8;k[a+2|0]=d>>>16;k[a+3|0]=d>>>24;k[a+4|0]=b;k[a+5|0]=b>>>8;k[a+6|0]=b>>>16;k[a+7|0]=b>>>24;b=n[1124]|n[1125]<<8;k[a+16|0]=b;k[a+17|0]=b>>>8;b=n[1120]|n[1121]<<8|(n[1122]<<16|n[1123]<<24);d=n[1116]|n[1117]<<8|(n[1118]<<16|n[1119]<<24);k[a+8|0]=d;k[a+9|0]=d>>>8;k[a+10|0]=d>>>16;k[a+11|0]=d>>>24;k[a+12|0]=b;k[a+13|0]=b>>>8;k[a+14|0]=b>>>16;k[a+15|0]=b>>>24;break a}T(e+24|0,e,a,d>>>1|0);aa(a);a=0;c=$(33);while(1){b=a<<1;d=n[a+e|0];k[b+c|0]=n[(d>>>4|0)+1024|0];k[(b|1)+c|0]=n[(d&15)+1024|0];a=a+1|0;if((a|0)!=16){continue}break}k[c+32|0]=0}H=e+272|0;return c|0}function Q(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,l=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;u=m[b+240>>2];d=(u<<4)+b|0;g=m[a>>2]^m[d>>2];m[a>>2]=g;c=m[a+4>>2]^m[d+4>>2];m[a+4>>2]=c;i=m[a+8>>2]^m[d+8>>2];m[a+8>>2]=i;e=m[a+12>>2]^m[d+12>>2];m[a+12>>2]=e;h=g>>>16|0;q=g>>>8|0;r=c>>>16|0;j=c>>>8|0;l=c>>>24|0;o=i>>>8|0;p=i>>>24|0;s=i>>>16|0;t=e>>>24|0;f=e>>>16|0;v=e>>>8|0;d=H+ -64|0;y=d+48|0;z=d+32|0;A=d+16|0;while(1){k[d+7|0]=n[(p&255)+1472|0];k[d+6|0]=n[(f&255)+1472|0];k[d+5|0]=n[(q&255)+1472|0];k[d+4|0]=n[(c&255)+1472|0];k[d+3|0]=n[(l&255)+1472|0];k[d+2|0]=n[(s&255)+1472|0];k[d+1|0]=n[(v&255)+1472|0];k[d|0]=n[(g&255)+1472|0];k[d+11|0]=n[(t&255)+1472|0];k[d+10|0]=n[(h&255)+1472|0];k[d+9|0]=n[(j&255)+1472|0];k[d+8|0]=n[(i&255)+1472|0];k[d+14|0]=n[(r&255)+1472|0];k[d+13|0]=n[(o&255)+1472|0];k[d+12|0]=n[(e&255)+1472|0];k[d+15|0]=n[n[a+3|0]+1472|0];u=u-1|0;c=(u<<4)+b|0;e=m[d>>2]^m[c>>2];m[d>>2]=e;g=m[d+4>>2]^m[c+4>>2];m[d+4>>2]=g;h=m[d+8>>2]^m[c+8>>2];m[d+8>>2]=h;m[d+12>>2]=m[d+12>>2]^m[c+12>>2];a:{if(u){q=e>>>24|0;r=g>>>8|0;j=g>>>16|0;l=g>>>24|0;o=h>>>8|0;p=h>>>16|0;s=h>>>24|0;t=0;e=0;while(1){i=e<<4;e=e+1|0;c=d+(e<<4)|0;i=d+i|0;f=k[i|0];k[c|0]=f>>>7&27^f<<1;f=k[i+1|0];k[c+1|0]=f>>>7&27^f<<1;f=k[i+2|0];s=s<<24>>24>>>7&27^s<<1;k[c+11|0]=s;p=p<<24>>24>>>7&27^p<<1;k[c+10|0]=p;o=o<<24>>24>>>7&27^o<<1;k[c+9|0]=o;h=h<<24>>24>>>7&27^h<<1;k[c+8|0]=h;l=l<<24>>24>>>7&27^l<<1;k[c+7|0]=l;j=j<<24>>24>>>7&27^j<<1;k[c+6|0]=j;r=r<<24>>24>>>7&27^r<<1;k[c+5|0]=r;g=g<<24>>24>>>7&27^g<<1;k[c+4|0]=g;q=q<<24>>24>>>7&27^q<<1;k[c+3|0]=q;k[c+2|0]=f>>>7&27^f<<1;f=k[i+12|0];k[c+12|0]=f>>>7&27^f<<1;f=k[i+13|0];k[c+13|0]=f>>>7&27^f<<1;f=k[i+14|0];k[c+14|0]=f>>>7&27^f<<1;w=c;c=k[i+15|0];k[w+15|0]=c>>>7&27^c<<1;if((e|0)!=3){continue}break}while(1){c=t<<2;g=c|3;q=n[g+d|0];e=c|2;r=n[e+d|0];p=n[g+y|0];o=n[e+y|0];i=n[e+z|0];h=c|1;s=n[h+d|0];j=n[c+y|0];f=n[c+z|0];v=n[c+A|0];x=n[h+A|0];l=n[h+y|0];k[a+c|0]=p^(q^(o^(i^(r^(s^(j^(f^v))^x^l)))));C=a+h|0;B=n[g+z|0];h=n[h+z|0];c=n[d+c|0];w=h^(c^(p^(q^(o^(r^(l^(j^x)))))));x=n[e+A|0];k[C|0]=B^(w^x);w=a+e|0;e=n[g+A|0];k[w|0]=e^(x^(c^(p^(q^(o^(l^(s^(f^j))^i))))));k[a+g|0]=e^(h^(c^(p^(o^(r^(l^(s^(j^v)))))))^B);t=t+1|0;if((t|0)!=4){continue}break}break a}b=m[d+4>>2];m[a>>2]=m[d>>2];m[a+4>>2]=b;b=m[d+12>>2];m[a+8>>2]=m[d+8>>2];m[a+12>>2]=b;return}r=n[a+6|0];o=n[a+9|0];e=n[a+12|0];t=n[a+15|0];h=n[a+2|0];j=n[a+5|0];i=n[a+8|0];p=n[a+11|0];f=n[a+14|0];q=n[a+1|0];c=n[a+4|0];l=n[a+7|0];s=n[a+10|0];v=n[a+13|0];g=n[a|0];continue}}function P(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,l=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;x=m[b+240>>2];F=x-1|0;while(1){e=(w<<4)+b|0;f=m[a+8>>2]^m[e+8>>2];c=n[(f>>>24|0)+1216|0];g=m[a+12>>2]^m[e+12>>2];d=n[(g&255)+1216|0];i=m[a+4>>2]^m[e+4>>2];l=n[(i>>>24|0)+1216|0];o=n[(f&255)+1216|0];h=m[a>>2]^m[e>>2];e=n[(h>>>24|0)+1216|0];p=n[(i&255)+1216|0];q=n[(g>>>24|0)+1216|0];r=n[(h&255)+1216|0];s=n[(i>>>16&255)+1216|0];j=n[(h>>>8&255)+1216|0];h=n[(h>>>16&255)+1216|0];t=n[(g>>>8&255)+1216|0];g=n[(g>>>16&255)+1216|0];u=n[(f>>>8&255)+1216|0];f=n[(f>>>16&255)+1216|0];i=n[(i>>>8&255)+1216|0];if((w|0)!=(F|0)){v=c<<24>>24>>>7&27^c<<1;y=s<<24>>24>>>7&27^s<<1;k[a+14|0]=v^(y^(d^(c^j)));z=l<<24>>24>>>7&27^l<<1;A=h<<24>>24>>>7&27^h<<1;k[a+10|0]=z^(A^(l^t^o));B=e<<24>>24>>>7&27^e<<1;C=g<<24>>24>>>7&27^g<<1;k[a+6|0]=B^(C^(e^u^p));D=q<<24>>24>>>7&27^q<<1;E=f<<24>>24>>>7&27^f<<1;k[a+2|0]=D^(E^(i^q^r));G=v;v=j^(d<<24>>24>>>7&27^d<<1);k[a+15|0]=G^(d^(v^s));j=j<<24>>24>>>7&27^j<<1;k[a+13|0]=d^(c^(j^s))^y;k[a+12|0]=c^(j^v^s);c=o<<24>>24>>>7&27^o<<1^t;k[a+11|0]=c^h^o^z;d=t<<24>>24>>>7&27^t<<1;k[a+9|0]=d^h^l^o^A;k[a+8|0]=h^(c^d)^l;c=p<<24>>24>>>7&27^p<<1^u;k[a+7|0]=c^g^p^B;d=u<<24>>24>>>7&27^u<<1;k[a+5|0]=e^(d^g)^p^C;k[a+4|0]=e^(g^(c^d));c=i^(r<<24>>24>>>7&27^r<<1);k[a+3|0]=c^f^r^D;d=i<<24>>24>>>7&27^i<<1;k[a+1|0]=d^f^q^r^E;k[a|0]=f^(c^d)^q;w=w+1|0;continue}break}b=(x<<4)+b|0;m[a>>2]=m[b>>2]^(q<<24|f<<16|i<<8|r);m[a+4>>2]=m[b+4>>2]^(e<<24|g<<16|u<<8|p);m[a+8>>2]=m[b+8>>2]^(l<<24|h<<16|t<<8|o);m[a+12>>2]=m[b+12>>2]^(d|(c<<24|s<<16|j<<8))}function Y(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,l=0,o=0;h=H-16|0;H=h;i=4;a:{b:{c:{d:{j=m[a>>2];switch(j|0){case 0:case 1:break b;case 2:break c;case 3:break d;default:break a}}R(m[a+60>>2],c,d)}X(a,b,c,d);i=0;break a}i=1;if(d&15){break a}i=0;if(!d){break a}o=a+12|0;while(1){e=c+8|0;f=n[e+4|0]|n[e+5|0]<<8|(n[e+6|0]<<16|n[e+7|0]<<24);l=h+8|0;g=l;m[g>>2]=n[e|0]|n[e+1|0]<<8|(n[e+2|0]<<16|n[e+3|0]<<24);m[g+4>>2]=f;f=c;g=n[f+4|0]|n[f+5|0]<<8|(n[f+6|0]<<16|n[f+7|0]<<24);m[h>>2]=n[f|0]|n[f+1|0]<<8|(n[f+2|0]<<16|n[f+3|0]<<24);m[h+4>>2]=g;Q(h,m[a+8>>2]);if(j){m[h>>2]=m[h>>2]^m[a+12>>2];m[h+4>>2]=m[h+4>>2]^m[a+16>>2];m[h+8>>2]=m[h+8>>2]^m[a+20>>2];m[h+12>>2]=m[h+12>>2]^m[a+24>>2];g=n[e+4|0]|n[e+5|0]<<8|(n[e+6|0]<<16|n[e+7|0]<<24);f=o;e=n[e|0]|n[e+1|0]<<8|(n[e+2|0]<<16|n[e+3|0]<<24);k[f+8|0]=e;k[f+9|0]=e>>>8;k[f+10|0]=e>>>16;k[f+11|0]=e>>>24;k[f+12|0]=g;k[f+13|0]=g>>>8;k[f+14|0]=g>>>16;k[f+15|0]=g>>>24;e=c;g=n[e+4|0]|n[e+5|0]<<8|(n[e+6|0]<<16|n[e+7|0]<<24);e=n[e|0]|n[e+1|0]<<8|(n[e+2|0]<<16|n[e+3|0]<<24);k[f|0]=e;k[f+1|0]=e>>>8;k[f+2|0]=e>>>16;k[f+3|0]=e>>>24;k[f+4|0]=g;k[f+5|0]=g>>>8;k[f+6|0]=g>>>16;k[f+7|0]=g>>>24}g=m[h+4>>2];e=b;f=m[h>>2];k[e|0]=f;k[e+1|0]=f>>>8;k[e+2|0]=f>>>16;k[e+3|0]=f>>>24;k[e+4|0]=g;k[e+5|0]=g>>>8;k[e+6|0]=g>>>16;k[e+7|0]=g>>>24;g=m[l+4>>2];f=m[l>>2];k[e+8|0]=f;k[e+9|0]=f>>>8;k[e+10|0]=f>>>16;k[e+11|0]=f>>>24;k[e+12|0]=g;k[e+13|0]=g>>>8;k[e+14|0]=g>>>16;k[e+15|0]=g>>>24;d=d-16|0;if(!d){break a}c=c+16|0;b=b+16|0;j=m[a>>2];continue}}H=h+16|0;return i}function M(a,b){var c=0,d=0,e=0,f=0;if(b){f=da(b)}d=$(f+32|0);c=n[1175]|n[1176]<<8|(n[1177]<<16|n[1178]<<24);e=n[1171]|n[1172]<<8|(n[1173]<<16|n[1174]<<24);k[d+5|0]=e;k[d+6|0]=e>>>8;k[d+7|0]=e>>>16;k[d+8|0]=e>>>24;k[d+9|0]=c;k[d+10|0]=c>>>8;k[d+11|0]=c>>>16;k[d+12|0]=c>>>24;c=n[1170]|n[1171]<<8|(n[1172]<<16|n[1173]<<24);e=n[1166]|n[1167]<<8|(n[1168]<<16|n[1169]<<24);k[d|0]=e;k[d+1|0]=e>>>8;k[d+2|0]=e>>>16;k[d+3|0]=e>>>24;k[d+4|0]=c;k[d+5|0]=c>>>8;k[d+6|0]=c>>>16;k[d+7|0]=c>>>24;a:{b:{switch(a-1|0){case 0:a=da(d)+d|0;c=n[1179]|n[1180]<<8|(n[1181]<<16|n[1182]<<24);k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=c>>>16;k[a+3|0]=c>>>24;c=n[1182]|n[1183]<<8|(n[1184]<<16|n[1185]<<24);k[a+3|0]=c;k[a+4|0]=c>>>8;k[a+5|0]=c>>>16;k[a+6|0]=c>>>24;break a;case 1:a=da(d)+d|0;c=n[1186]|n[1187]<<8;k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=n[1188];break a;case 2:a=da(d)+d|0;k[a|0]=77;k[a+1|0]=65;k[a+2|0]=67;k[a+3|0]=0;break a;case 3:a=da(d)+d|0;c=n[1189]|n[1190]<<8|(n[1191]<<16|n[1192]<<24);k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=c>>>16;k[a+3|0]=c>>>24;c=n[1192]|n[1193]<<8|(n[1194]<<16|n[1195]<<24);k[a+3|0]=c;k[a+4|0]=c>>>8;k[a+5|0]=c>>>16;k[a+6|0]=c>>>24;break a;default:break b}}a=da(d)+d|0;c=n[1196]|n[1197]<<8|(n[1198]<<16|n[1199]<<24);k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=c>>>16;k[a+3|0]=c>>>24;c=n[1200]|n[1201]<<8;k[a+4|0]=c;k[a+5|0]=c>>>8}if(f){a=da(d)+d|0;c=n[1202]|n[1203]<<8;k[a|0]=c;k[a+1|0]=c>>>8;k[a+2|0]=n[1204];Z(da(d)+d|0,b)}return d}function X(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,l=0,o=0,p=0;a:{if(!d){break a}g=a+12|0;f=a+28|0;while(1){e=m[a+4>>2];while(1){if(e){k[b|0]=n[(f-e|0)+16|0]^n[c|0];e=m[a+4>>2]-1|0;m[a+4>>2]=e;b=b+1|0;c=c+1|0;d=d-1|0;if(d){continue}break a}break}if(d>>>0>=16){while(1){e=m[g+4>>2];m[f>>2]=m[g>>2];m[f+4>>2]=e;e=m[g+12>>2];m[f+8>>2]=m[g+8>>2];m[f+12>>2]=e;P(f,m[a+8>>2]);e=16;while(1){b:{e=e-1|0;i=g+e|0;h=n[i|0]+1|0;k[i|0]=h;if(!e){break b}if((h|0)!=(h&255)){continue}}break}h=m[a+28>>2];i=n[c|0]|n[c+1|0]<<8|(n[c+2|0]<<16|n[c+3|0]<<24);j=m[a+32>>2];l=n[c+4|0]|n[c+5|0]<<8|(n[c+6|0]<<16|n[c+7|0]<<24);o=m[a+36>>2];p=n[c+8|0]|n[c+9|0]<<8|(n[c+10|0]<<16|n[c+11|0]<<24);e=m[a+40>>2]^(n[c+12|0]|n[c+13|0]<<8|(n[c+14|0]<<16|n[c+15|0]<<24));k[b+12|0]=e;k[b+13|0]=e>>>8;k[b+14|0]=e>>>16;k[b+15|0]=e>>>24;e=o^p;k[b+8|0]=e;k[b+9|0]=e>>>8;k[b+10|0]=e>>>16;k[b+11|0]=e>>>24;e=j^l;k[b+4|0]=e;k[b+5|0]=e>>>8;k[b+6|0]=e>>>16;k[b+7|0]=e>>>24;e=h^i;k[b|0]=e;k[b+1|0]=e>>>8;k[b+2|0]=e>>>16;k[b+3|0]=e>>>24;b=b+16|0;c=c+16|0;d=d-16|0;if(d>>>0>15){continue}break}if(!d){break a}}e=m[g+4>>2];m[f>>2]=m[g>>2];m[f+4>>2]=e;e=m[g+12>>2];m[f+8>>2]=m[g+8>>2];m[f+12>>2]=e;e=16;m[a+4>>2]=16;P(f,m[a+8>>2]);while(1){c:{e=e-1|0;i=g+e|0;h=n[i|0]+1|0;k[i|0]=h;if(!e){break c}if((h|0)!=(h&255)){continue}}break}if(d){continue}break}}}function W(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,l=0;f=H-16|0;H=f;j=4;a:{b:{c:{d:{e:{h=m[a>>2];switch(h|0){case 2:break c;case 0:case 1:break d;case 3:break e;default:break a}}X(a,b,c,d);R(m[a+60>>2],b,d);break b}j=1;if(d&15){break a}j=0;if(!d){break a}l=a+12|0;while(1){e=c;i=n[e+12|0]|n[e+13|0]<<8|(n[e+14|0]<<16|n[e+15|0]<<24);g=f+8|0;m[g>>2]=n[e+8|0]|n[e+9|0]<<8|(n[e+10|0]<<16|n[e+11|0]<<24);m[g+4>>2]=i;i=n[e+4|0]|n[e+5|0]<<8|(n[e+6|0]<<16|n[e+7|0]<<24);m[f>>2]=n[e|0]|n[e+1|0]<<8|(n[e+2|0]<<16|n[e+3|0]<<24);m[f+4>>2]=i;f:{if(!h){P(f,m[a+8>>2]);break f}m[f>>2]=m[f>>2]^m[a+12>>2];m[f+4>>2]=m[f+4>>2]^m[a+16>>2];m[g>>2]=m[g>>2]^m[a+20>>2];m[f+12>>2]=m[f+12>>2]^m[a+24>>2];P(f,m[a+8>>2]);e=m[g+4>>2];m[l+8>>2]=m[g>>2];m[l+12>>2]=e;e=m[f+4>>2];m[l>>2]=m[f>>2];m[l+4>>2]=e}h=m[f+4>>2];e=b;i=m[f>>2];k[e|0]=i;k[e+1|0]=i>>>8;k[e+2|0]=i>>>16;k[e+3|0]=i>>>24;k[e+4|0]=h;k[e+5|0]=h>>>8;k[e+6|0]=h>>>16;k[e+7|0]=h>>>24;h=m[g+4>>2];g=m[g>>2];k[e+8|0]=g;k[e+9|0]=g>>>8;k[e+10|0]=g>>>16;k[e+11|0]=g>>>24;k[e+12|0]=h;k[e+13|0]=h>>>8;k[e+14|0]=h>>>16;k[e+15|0]=h>>>24;d=d-16|0;if(!d){break a}c=c+16|0;b=b+16|0;h=m[a>>2];continue}}X(a,b,c,d)}j=0}H=f+16|0;return j}function ca(a,b,c){var d=0,e=0,f=0;if(c>>>0>=512){G(a|0,b|0,c|0)|0;return a}e=a+c|0;a:{if(!((a^b)&3)){b:{if((c|0)<1){c=a;break b}if(!(a&3)){c=a;break b}c=a;while(1){k[c|0]=n[b|0];b=b+1|0;c=c+1|0;if(e>>>0<=c>>>0){break b}if(c&3){continue}break}}d=e&-4;c:{if(d>>>0<64){break c}f=d+ -64|0;if(f>>>0<c>>>0){break c}while(1){m[c>>2]=m[b>>2];m[c+4>>2]=m[b+4>>2];m[c+8>>2]=m[b+8>>2];m[c+12>>2]=m[b+12>>2];m[c+16>>2]=m[b+16>>2];m[c+20>>2]=m[b+20>>2];m[c+24>>2]=m[b+24>>2];m[c+28>>2]=m[b+28>>2];m[c+32>>2]=m[b+32>>2];m[c+36>>2]=m[b+36>>2];m[c+40>>2]=m[b+40>>2];m[c+44>>2]=m[b+44>>2];m[c+48>>2]=m[b+48>>2];m[c+52>>2]=m[b+52>>2];m[c+56>>2]=m[b+56>>2];m[c+60>>2]=m[b+60>>2];b=b- -64|0;c=c- -64|0;if(f>>>0>=c>>>0){continue}break}}if(c>>>0>=d>>>0){break a}while(1){m[c>>2]=m[b>>2];b=b+4|0;c=c+4|0;if(d>>>0>c>>>0){continue}break}break a}if(e>>>0<4){c=a;break a}d=e-4|0;if(d>>>0<a>>>0){c=a;break a}c=a;while(1){k[c|0]=n[b|0];k[c+1|0]=n[b+1|0];k[c+2|0]=n[b+2|0];k[c+3|0]=n[b+3|0];b=b+4|0;c=c+4|0;if(d>>>0>=c>>>0){continue}break}}if(c>>>0<e>>>0){while(1){k[c|0]=n[b|0];b=b+1|0;c=c+1|0;if((e|0)!=(c|0)){continue}break}}return a}function R(a,b,c){var d=0,e=0,f=0,g=0;a:{if(!c){break a}d=m[a+36>>2];if(d>>>0<=15){e=(a+d|0)+20|0;d=16-d|0;d=c>>>0<d>>>0?c:d;ca(e,b,d);m[a+36>>2]=d+m[a+36>>2];c=c-d|0;if(!c){break a}b=b+d|0}m[a+4>>2]=m[a+4>>2]^m[a+20>>2];d=a+8|0;m[d>>2]=m[d>>2]^m[a+24>>2];d=a+12|0;m[d>>2]=m[d>>2]^m[a+28>>2];d=a+16|0;m[d>>2]=m[d>>2]^m[a+32>>2];g=a+4|0;P(g,m[a>>2]);d=a+20|0;if(c>>>0>=17){while(1){e=n[b+4|0]|n[b+5|0]<<8|(n[b+6|0]<<16|n[b+7|0]<<24);f=n[b|0]|n[b+1|0]<<8|(n[b+2|0]<<16|n[b+3|0]<<24);k[d|0]=f;k[d+1|0]=f>>>8;k[d+2|0]=f>>>16;k[d+3|0]=f>>>24;k[d+4|0]=e;k[d+5|0]=e>>>8;k[d+6|0]=e>>>16;k[d+7|0]=e>>>24;e=n[b+12|0]|n[b+13|0]<<8|(n[b+14|0]<<16|n[b+15|0]<<24);f=n[b+8|0]|n[b+9|0]<<8|(n[b+10|0]<<16|n[b+11|0]<<24);k[d+8|0]=f;k[d+9|0]=f>>>8;k[d+10|0]=f>>>16;k[d+11|0]=f>>>24;k[d+12|0]=e;k[d+13|0]=e>>>8;k[d+14|0]=e>>>16;k[d+15|0]=e>>>24;m[a+4>>2]=m[a+4>>2]^m[a+20>>2];m[a+8>>2]=m[a+8>>2]^m[a+24>>2];m[a+12>>2]=m[a+12>>2]^m[a+28>>2];m[a+16>>2]=m[a+16>>2]^m[a+32>>2];P(g,m[a>>2]);b=b+16|0;c=c-16|0;if(c>>>0>16){continue}break}}m[a+36>>2]=c;m[d+8>>2]=0;m[d+12>>2]=0;m[d>>2]=0;m[d+4>>2]=0;ca(d,b,c)}}function S(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;d=H-48|0;H=d;m[d+40>>2]=0;m[d+44>>2]=0;m[d+32>>2]=0;m[d+36>>2]=0;P(d+32|0,m[a>>2]);g=k[d+32|0];e=g;while(1){f=(d+16|0)+c|0;h=e<<1;c=c+1|0;e=n[c+(d+32|0)|0];k[f|0]=h|e<<24>>>31;if((c|0)!=15){continue}break}g=g>>7&-121^n[d+47|0]<<1;k[d+31|0]=g;c=0;f=k[d+16|0];e=f;while(1){h=d+c|0;i=e<<1;c=c+1|0;e=n[c+(d+16|0)|0];k[h|0]=i|e<<24>>>31;if((c|0)!=15){continue}break}k[d+15|0]=f>>>7&135^g<<1;c=m[a+36>>2];a:{if(c>>>0<=15){k[c+(a+20|0)|0]=128;c=m[a+20>>2]^m[d>>2];m[a+20>>2]=c;e=a+24|0;g=m[e>>2]^m[d+4>>2];m[e>>2]=g;f=a+28|0;e=m[f>>2]^m[d+8>>2];m[f>>2]=e;h=a+32|0;f=m[h>>2]^m[d+12>>2];break a}c=m[a+20>>2]^m[d+16>>2];m[a+20>>2]=c;e=a+24|0;g=m[e>>2]^m[d+20>>2];m[e>>2]=g;f=a+28|0;e=m[f>>2]^m[d+24>>2];m[f>>2]=e;h=a+32|0;f=m[h>>2]^m[d+28>>2]}m[h>>2]=f;m[a+4>>2]=m[a+4>>2]^c;c=a+8|0;m[c>>2]=m[c>>2]^g;c=a+12|0;m[c>>2]=m[c>>2]^e;e=a+16|0;m[e>>2]=m[e>>2]^f;e=a+4|0;P(e,m[a>>2]);ca(b,e,16);m[a+36>>2]=0;m[a+28>>2]=0;m[a+32>>2]=0;m[a+20>>2]=0;m[a+24>>2]=0;m[c>>2]=0;m[c+4>>2]=0;m[a+4>>2]=0;m[a+8>>2]=0;H=d+48|0}function U(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0;a:{if(!((b|0)==128|(b|0)==256)){f=1;if((b|0)!=192){break a}}e=b>>>5|0;m[a+240>>2]=e+6;f=0;a=ca(a,c,b>>>3|0);g=(m[a+240>>2]<<2)+4|0;if(g>>>0<=e>>>0){break a}i=b>>>0<224;b=e;while(1){h=(b>>>0)/(e>>>0)|0;c=b-s(h,e)|0;b:{if(!c){c=a+(b<<2)|0;d=c-4|0;k[c+1|0]=n[n[d+2|0]+1216|0];k[c+2|0]=n[n[d+3|0]+1216|0];k[c+3|0]=n[n[d|0]+1216|0];k[c|0]=n[h+1728|0]^n[n[d+1|0]+1216|0];m[c>>2]=m[c>>2]^m[a+(b-e<<2)>>2];break b}if(!((c|0)!=4|i)){c=a+(b<<2)|0;d=c-4|0;k[c|0]=n[n[d|0]+1216|0];k[c+1|0]=n[n[d+1|0]+1216|0];k[c+2|0]=n[n[d+2|0]+1216|0];k[c+3|0]=n[n[d+3|0]+1216|0];m[c>>2]=m[c>>2]^m[a+(b-e<<2)>>2];break b}c=a+(b<<2)|0;m[c>>2]=m[c-4>>2]^m[a+(b-e<<2)>>2]}b=b+1|0;if((g|0)!=(b|0)){continue}break}}return f}function V(a,b,c,d){var e=0;e=4;a:{if((b|0)==3){break a}m[a+8>>2]=c;e=0;m[a+4>>2]=0;m[a>>2]=b;if(!d){e=2;if(b){break a}m[a+12>>2]=0;m[a+16>>2]=0;m[a+20>>2]=0;m[a+24>>2]=0;return 0}b=n[d+4|0]|n[d+5|0]<<8|(n[d+6|0]<<16|n[d+7|0]<<24);c=n[d|0]|n[d+1|0]<<8|(n[d+2|0]<<16|n[d+3|0]<<24);k[a+12|0]=c;k[a+13|0]=c>>>8;k[a+14|0]=c>>>16;k[a+15|0]=c>>>24;k[a+16|0]=b;k[a+17|0]=b>>>8;k[a+18|0]=b>>>16;k[a+19|0]=b>>>24;b=n[d+12|0]|n[d+13|0]<<8|(n[d+14|0]<<16|n[d+15|0]<<24);c=n[d+8|0]|n[d+9|0]<<8|(n[d+10|0]<<16|n[d+11|0]<<24);k[a+20|0]=c;k[a+21|0]=c>>>8;k[a+22|0]=c>>>16;k[a+23|0]=c>>>24;k[a+24|0]=b;k[a+25|0]=b>>>8;k[a+26|0]=b>>>16;k[a+27|0]=b>>>24}return e}function Z(a,b){var c=0;a:{b:{if((a^b)&3){break b}if(b&3){while(1){c=n[b|0];k[a|0]=c;if(!c){break a}a=a+1|0;b=b+1|0;if(b&3){continue}break}}c=m[b>>2];if((c^-1)&c-16843009&-2139062144){break b}while(1){m[a>>2]=c;c=m[b+4>>2];a=a+4|0;b=b+4|0;if(!(c-16843009&(c^-1)&-2139062144)){continue}break}}c=n[b|0];k[a|0]=c;if(!c){break a}while(1){c=n[b+1|0];k[a+1|0]=c;a=a+1|0;b=b+1|0;if(c){continue}break}}}function K(a){var b=0,c=0,d=0,e=0,f=0;if(!a){return 0}f=da(a);e=$(f>>>1|0);if(f){while(1){c=-48;a:{b=n[a+d|0];if((b-48&255)>>>0<10){break a}c=-55;if((b-65&255)>>>0<6){break a}c=-87;if((b-97&255)>>>0<6){break a}aa(e);return 0}c=c+b|0;b:{if(!(d&1)){k[(d>>>1|0)+e|0]=c<<4;break b}b=(d>>>1|0)+e|0;k[b|0]=c+n[b|0]}d=d+1|0;if((f|0)!=(d|0)){continue}break}}return e}function da(a){var b=0,c=0,d=0;a:{b:{b=a;if(!(b&3)){break b}if(!n[a|0]){return 0}while(1){b=b+1|0;if(!(b&3)){break b}if(n[b|0]){continue}break}break a}while(1){c=b;b=b+4|0;d=m[c>>2];if(!((d^-1)&d-16843009&-2139062144)){continue}break}if(!(d&255)){return c-a|0}while(1){d=n[c+1|0];b=c+1|0;c=b;if(d){continue}break}}return b-a|0}function T(a,b,c,d){var e=0;e=H-48|0;H=e;m[e+20>>2]=0;m[e+24>>2]=0;m[e+28>>2]=0;m[e+32>>2]=0;m[e+36>>2]=0;m[e+40>>2]=0;m[e+44>>2]=0;m[e+12>>2]=0;m[e+16>>2]=0;m[e+8>>2]=a;R(e+8|0,c,d);S(e+8|0,b);H=e+48|0}function ba(a){var b=0,c=0;b=m[435];c=a+3&-4;a=b+c|0;a:{if(a>>>0<=b>>>0?(c|0)>=1:0){break a}if(a>>>0>ma()<<16>>>0){if(!(F(a|0)|0)){break a}}m[435]=a;return b}m[436]=48;return-1}function ha(a){var b=0;b=a&31;a=0-a&31;return(-1>>>b&-2)<<b|(-1<<a&-2)>>>a}



function ga(a){a=a|0;a=H-a&-16;H=a;return a|0}function fa(a){a=a|0;H=a}function ea(){return H|0}function _(){return 1744}function J(){}
// EMSCRIPTEN_END_FUNCS
a=n;ka(ua);var I=ia([]);function ma(){return j.byteLength/65536|0}return{"__indirect_function_table":I,"__wasm_call_ctors":J,"malloc":$,"free":aa,"hex_encrypt":L,"hex_decrypt":N,"hex_cmac":O,"__errno_location":_,"stackSave":ea,"stackRestore":fa,"stackAlloc":ga}}return la(na)}


// EMSCRIPTEN_END_ASM




)(asmLibraryArg)},instantiate:function(binary,info){return{then:function(ok){var module=new WebAssembly.Module(binary);ok({"instance":new WebAssembly.Instance(module)})}}},RuntimeError:Error};wasmBinary=[];if(typeof WebAssembly!=="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}function getCFunc(ident){var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret},"array":function(arr){var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string")return UTF8ToString(ret);if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);ret=convertReturnValue(ret);if(stack!==0)stackRestore(stack);return ret}var ALLOC_STACK=1;var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heap,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heap[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heap.subarray&&UTF8Decoder){return UTF8Decoder.decode(heap.subarray(idx,endPtr))}else{var str="";while(idx<endPtr){var u0=heap[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heap[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heap[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heap[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127)++len;else if(u<=2047)len+=2;else if(u<=65535)len+=3;else len+=4}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){HEAP8[buffer++>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>0]=0}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;if(Module["wasmMemory"]){wasmMemory=Module["wasmMemory"]}else{wasmMemory=new WebAssembly.Memory({"initial":INITIAL_MEMORY/65536,"maximum":INITIAL_MEMORY/65536})}if(wasmMemory){buffer=wasmMemory.buffer}INITIAL_MEMORY=buffer.byteLength;updateGlobalBufferAndViews(buffer);var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){runtimeExited=true}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what+="";err(what);ABORT=true;EXITSTATUS=1;what="abort("+what+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(what);throw e}function hasPrefix(str,prefix){return String.prototype.startsWith?str.startsWith(prefix):str.indexOf(prefix)===0}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return hasPrefix(filename,dataURIPrefix)}var fileURIPrefix="file://";function isFileURI(filename){return hasPrefix(filename,fileURIPrefix)}var wasmBinaryFile="aes_asm.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(){try{if(wasmBinary){return new Uint8Array(wasmBinary)}var binary=tryParseAsDataURI(wasmBinaryFile);if(binary){return binary}if(readBinary){return readBinary(wasmBinaryFile)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&typeof fetch==="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary()})}return Promise.resolve().then(getBinary)}function createWasm(){var info={"env":asmLibraryArg,"wasi_snapshot_preview1":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmTable=Module["asm"]["__indirect_function_table"];removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiatedSource(output){receiveInstance(output["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiatedSource,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiatedSource)})})}else{return instantiateArrayBuffer(receiveInstantiatedSource)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync();return{}}var tempDouble;var tempI64;function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){wasmTable.get(func)()}else{wasmTable.get(func)(callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}function demangle(func){return func}function demangleAll(text){var regex=/\b_Z[\w\d_]+/g;return text.replace(regex,function(x){var y=demangle(x);return x===y?x:y+" ["+x+"]"})}function jsStackTrace(){var error=new Error;if(!error.stack){try{throw new Error}catch(e){error=e}if(!error.stack){return"(no stack trace available)"}}return error.stack.toString()}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}function abortOnCannotGrowMemory(requestedSize){abort("OOM")}function _emscripten_resize_heap(requestedSize){requestedSize=requestedSize>>>0;abortOnCannotGrowMemory(requestedSize)}var ASSERTIONS=false;function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){if(ASSERTIONS){assert(false,"Character code "+chr+" ("+String.fromCharCode(chr)+")  at offset "+i+" not in 0x00-0xFF.")}chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}var decodeBase64=typeof atob==="function"?atob:function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2)}if(enc4!==64){output=output+String.fromCharCode(chr3)}}while(i<input.length);return output};function intArrayFromBase64(s){if(typeof ENVIRONMENT_IS_NODE==="boolean"&&ENVIRONMENT_IS_NODE){var buf;try{buf=Buffer.from(s,"base64")}catch(_){buf=new Buffer(s,"base64")}return new Uint8Array(buf["buffer"],buf["byteOffset"],buf["byteLength"])}try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i)}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}__ATINIT__.push({func:function(){___wasm_call_ctors()}});var asmLibraryArg={"emscripten_memcpy_big":_emscripten_memcpy_big,"emscripten_resize_heap":_emscripten_resize_heap,"getTempRet0":getTempRet0,"memory":wasmMemory,"setTempRet0":setTempRet0};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["__wasm_call_ctors"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return(_malloc=Module["_malloc"]=Module["asm"]["malloc"]).apply(null,arguments)};var _free=Module["_free"]=function(){return(_free=Module["_free"]=Module["asm"]["free"]).apply(null,arguments)};var _hex_encrypt=Module["_hex_encrypt"]=function(){return(_hex_encrypt=Module["_hex_encrypt"]=Module["asm"]["hex_encrypt"]).apply(null,arguments)};var _hex_decrypt=Module["_hex_decrypt"]=function(){return(_hex_decrypt=Module["_hex_decrypt"]=Module["asm"]["hex_decrypt"]).apply(null,arguments)};var _hex_cmac=Module["_hex_cmac"]=function(){return(_hex_cmac=Module["_hex_cmac"]=Module["asm"]["hex_cmac"]).apply(null,arguments)};var ___errno_location=Module["___errno_location"]=function(){return(___errno_location=Module["___errno_location"]=Module["asm"]["__errno_location"]).apply(null,arguments)};var stackSave=Module["stackSave"]=function(){return(stackSave=Module["stackSave"]=Module["asm"]["stackSave"]).apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){return(stackRestore=Module["stackRestore"]=Module["asm"]["stackRestore"]).apply(null,arguments)};var stackAlloc=Module["stackAlloc"]=function(){return(stackAlloc=Module["stackAlloc"]=Module["asm"]["stackAlloc"]).apply(null,arguments)};Module["ccall"]=ccall;Module["UTF8ToString"]=UTF8ToString;var calledRun;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0)return;function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}Module["run"]=run;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}noExitRuntime=true;run();

}).call(this)}).call(this,require('_process'),require("buffer").Buffer,"/")
},{"_process":8,"buffer":5,"fs":4,"path":7}],3:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":3,"buffer":5,"ieee754":6}],6:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],7:[function(require,module,exports){
(function (process){(function (){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this)}).call(this,require('_process'))
},{"_process":8}],8:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1])(1)
});
