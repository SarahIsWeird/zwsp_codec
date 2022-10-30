const assert = require('assert');
const { encodeZwsp, decodeZwsp } = require('../index');

const testEncoded = '\u200c\u2060\u200c\u200b\u200c\u200d\u200c\u200c\u200c\u2060\u200b\u2060\u200c\u2060\u200c\u200b';

describe('zwsp_codec', () => {
    describe('encode()', () => {
        it('encodes a buffer to only zero-width spaces', () => {
            const buffer = Buffer.from('test');
            const result = encodeZwsp(buffer);

            assert.equal(result, testEncoded);
        });

        it('encodes an empty buffer to an empty string', () => {
            assert.equal(encodeZwsp(Buffer.of()), '');
        });

        it('encodes a decoded string to the start buffer', () => {
            const initial = testEncoded;
            const decoded = decodeZwsp(initial);

            assert.equal(initial, encodeZwsp(decoded));
        });

        it('encodes a string the same as a buffer', () => {
            const buffer = Buffer.from('test');
            const result = encodeZwsp(buffer);

            assert.equal(encodeZwsp('test'), result);
        });

        it('encodes an empty string to an empty string', () => {
            assert.equal(encodeZwsp(''), '');
        });
    });

    describe('decode()', () => {
        it('decodes a zero-width space string to a buffer', () => {
            const result = decodeZwsp(testEncoded);

            assert.equal('test', result);
        });

        it('fails if the string length isn\'t divisible by 4', () => {
            assert.throws(() => decodeZwsp('\u200c\u2060'));
        });

        it('fails if the string contains invalid characters', () => {
            assert.throws(() => decodeZwsp('test'));
        });

        it('decodes an encoded string to the start buffer', () => {
            const initial = 'test';
            const encoded = encodeZwsp(Buffer.from(initial));

            assert.equal(decodeZwsp(encoded).toString(), initial);
        })
    });
});
