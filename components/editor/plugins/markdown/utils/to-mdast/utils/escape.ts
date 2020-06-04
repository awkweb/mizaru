// @ts-ignore
import escapes from 'markdown-escapes'

import { backslash, lineFeed, settings } from '../constants'

function escape(value: string) {
    let out = ''
    let previousChar
    const allowlist = escapes(settings)
    const denylist = [backslash, lineFeed]

    for (const char of value) {
        if (
            previousChar === backslash &&
            denylist.indexOf(char) === -1 &&
            allowlist.indexOf(char) !== -1
        ) {
            out += backslash + backslash
        }

        out += char
        previousChar = char
    }

    return out
}

export default escape
