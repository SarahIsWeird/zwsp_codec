# zwsp_codec

zwsp_codec is a small module that allows you to encode and decode arbitrary buffers and strings to a representation
purely made of zero-width spaces. This can be useful if you want to transmit additional data while not making your URL
a lot longer. The spaces used are guaranteed to work in URLs at least for Discord. If there are other messaging apps
where these work, let me know, and I'll add them to this description.

## An example link with included zero-width spaces

![https://example.com/ with zero-width spaces after the URL, not rendered by Discord](https://egirl.rip/6ph7XVe9Gz.png?key=IZOltDzAj4hWt5)

Obviously you can't see it, but the zero-width spaces after https://example.com/ would be decoded to `Hello, world!`.

## Getting started

Install the package from npm:

```bash
npm install zwsp_codec
```

Then you can use the module in your programs:

```js
// ES6
import { encodeZwsp, decodeZwsp } from 'zwsp_codec';

// Node.js
const { encodeZwsp, decodeZwsp } = require('zwsp_codec');

const buffer = Buffer.from('Hello, world!');
const encodedFromBuffer = encodeZwsp(buffer);
encodedFromBuffer // -> '\u200c\u2060\u200c\u200b\u200c\u200d\u200c\u200c\u200c\u2060\u200b\u2060\u200c\u2060\u200c\u200b'

const encodedFromString = encodeZwsp('Hello, world!');
encodedFromString === encodedFromBuffer // -> true

const decoded = decodeZwsp(encodedFromBuffer).toString('utf-8'); // -> 'Hello, world!'
```

`encodeZwsp` can encode both `Buffer`s and `String`s. The output is guaranteed to be the same for UTF-8.

`decodeZwsp` will always return a buffer, so if you want a string,
you need to decode the buffer with `decodeZwsp(encoded).toString('utf-8')`.

# License

zwsp_codec is licensed under the [WTFPL](http://www.wtfpl.net/). For more information, see the [LICENSE](LICENSE) file.
