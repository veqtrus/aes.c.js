WARNINGS := -pedantic -Wcast-align -Wpointer-arith \
	-Wbad-function-cast -Wmissing-prototypes -Wstrict-aliasing \
	-Wmissing-declarations -Winline -Wnested-externs -Wcast-qual \
	-Wshadow -Wwrite-strings -Wno-unused-parameter -Wfloat-equal
EXPORTED_FUNCTIONS := '_malloc', '_free', \
	'_hex_encrypt', '_hex_decrypt', '_hex_cmac'
CFLAGS := -O2 --memory-init-file 0 -s WASM=0 \
	-s EXPORT_NAME=exports \
	-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'UTF8ToString']" \
	-s "EXPORTED_FUNCTIONS=[$(EXPORTED_FUNCTIONS)]" $(WARNINGS)
CC := emcc

SOURCES := hex_aes.c vial_aes/aes.c
OBJECTS := aes-web.c.js aes.c.js aes_asm.js

.PHONY: all clean

all: $(OBJECTS)

aes-web.c.js: aes.c.js
	browserify aes.c.js --standalone AES -o aes-web.c.js

aes.c.js: aes.c.ts aes_asm.js
	tsc aes.c.ts

aes_asm.js: $(SOURCES)
	$(CC) -o $@ $^ $(CFLAGS)

clean:
	rm -f *.js

vial_aes/aes.c: vial_aes/aes.h
