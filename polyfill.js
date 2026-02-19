import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'react-native-quick-crypto';
import { Buffer } from 'buffer';

if (typeof global.Buffer === 'undefined') {
    global.Buffer = Buffer;
}
