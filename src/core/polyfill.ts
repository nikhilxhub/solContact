import 'react-native-url-polyfill/auto';
import { getRandomValues as expoCryptoGetRandomValues } from 'expo-crypto';
import { Buffer } from 'buffer';

global.Buffer = global.Buffer || Buffer;
globalThis.Buffer = globalThis.Buffer || Buffer;

class Crypto {
    getRandomValues = expoCryptoGetRandomValues;
}

const webCrypto = typeof crypto !== 'undefined' ? crypto : new Crypto();

if (typeof crypto === 'undefined') {
    Object.defineProperty(globalThis, 'crypto', {
        configurable: true,
        enumerable: true,
        get: () => webCrypto,
    });
    Object.defineProperty(global, 'crypto', {
        configurable: true,
        enumerable: true,
        get: () => webCrypto,
    });
}
