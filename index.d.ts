/**
 * Encodes a {@link Buffer} or {@link String} to a string made of only zero-width spaces.
 *
 * @example
 * const buffer = Buffer.from('test');
 * const fromBuffer = encodeZwsp(buffer);
 * fromBuffer === '\u200c\u2060\u200c\u200b\u200c\u200d\u200c\u200c\u200c\u2060\u200b\u2060\u200c\u2060\u200c\u200b' // -> true
 *
 * const fromString = encodeZwsp('test');
 * fromString === fromBuffer // -> true
 *
 * @param {Buffer | String} buffer The buffer or string to encode
 * @returns {string} The encoded string
 */
export function encodeZwsp(buffer: Buffer | string): string;
/**
 * Decodes a zero-width space string to the initial buffer.
 *
 * If you want the original string representation of that buffer, you'd call {@link Buffer.toString} on the result.
 *
 * @example
 * const encoded = '\u200c\u2060\u200c\u200b\u200c\u200d\u200c\u200c\u200c\u2060\u200b\u2060\u200c\u2060\u200c\u200b';
 * console.log(decodeZwsp(encoded)) // -> "<Buffer 74 65 73 74>"
 *
 * const decodedToString = decodeZwsp(encoded).toString('utf-8') // If you want the string representation
 * console.log(decodedToString) // -> "test"
 *
 * @param {String} str The string to decode
 * @returns {Buffer} The decoded buffer
 * @throws {ZwspDecodeError} If the string isn't a valid zwsp-encoded string
 */
export function decodeZwsp(str: string): Buffer;
/**
 * An error signalling that the decoding of the zero-width space string wasn't successful.
 */
export class ZwspDecodeError extends Error {
    constructor(message: string);
}
