const spaces = [
    '\u200b', // zero width space
    '\u200c', // zero width non-joiner
    '\u200d', // zero width joiner
    '\u2060', // word joiner
];

const space_values = spaces.map(val => val.codePointAt(0));

/**
 * An error signalling that the decoding of the zero-width space string wasn't successful.
 */
class ZwspDecodeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ZwspDecodeError';
    }
}

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
const encodeZwsp = (buffer) => {
    if (typeof buffer === 'string') {
        buffer = Buffer.from(buffer);
    }

    let encoded = '';

    for (const byte of buffer) {
        encoded += spaces[(byte >> 6) & 0x3];
        encoded += spaces[(byte >> 4) & 0x3];
        encoded += spaces[(byte >> 2) & 0x3];
        encoded += spaces[byte & 0x3];
    }

    return encoded;
};

const getValueFromCodePointOrThrow = (codePoint) => {
    const value = space_values.findIndex(val => val === codePoint);

    if (value === -1) {
        throw new ZwspDecodeError(`Invalid ZWSP value 0x${codePoint.toString(16)}!`);
    }

    return value;
};

const decodeCrumbs = (str) => {
    if (str.length % 4 !== 0) {
        throw new ZwspDecodeError('Unexpected odd length of string (must be divisible by 4)');
    }

    const crumbs = Buffer.alloc(str.length);

    for (let i = 0; i < str.length; i++) {
        crumbs[i] = getValueFromCodePointOrThrow(str.codePointAt(i));
    }

    return crumbs;
};

const nibblesFromCrumbs = (crumbs) => {
    const nibblesLen = crumbs.length / 2;
    const nibbles = Buffer.alloc(nibblesLen);

    for (let i = 0; i < nibblesLen; i++) {
        const high_crumb = crumbs[2 * i];
        const low_crumb = crumbs[2 * i + 1];

        nibbles[i] = (high_crumb << 2) + low_crumb;
    }

    return nibbles;
}

const bytesFromNibbles = (nibbles) => {
    const bytesLen = nibbles.length / 2;
    const bytes = Buffer.alloc(bytesLen);

    for (let i = 0; i < bytesLen; i++) {
        const high_nibble = nibbles[i * 2];
        const low_nibble = nibbles[i * 2 + 1];

        bytes[i] = (high_nibble << 4) + low_nibble;
    }

    return bytes;
};

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
const decodeZwsp = (str) => {
    const crumbs = decodeCrumbs(str);
    const nibbles = nibblesFromCrumbs(crumbs);

    return bytesFromNibbles(nibbles);
};

module.exports = {
    encodeZwsp: encodeZwsp,
    decodeZwsp: decodeZwsp,
    ZwspDecodeError: ZwspDecodeError,
};
