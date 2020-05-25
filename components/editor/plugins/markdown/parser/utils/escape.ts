// @ts-ignore
import escapes from 'markdown-escapes'

import { settings } from '../constants'

const backslash = '\\'

function escape(value: string) {
    let out = ''
    let previousChar
    const escape = escapes(settings)
    const denylist = [backslash, '\n']

    for (const char of value) {
        if (
            denylist.indexOf(char) === -1 &&
            previousChar === backslash &&
            escape.indexOf(char) !== -1
        ) {
            out += backslash
        }
        out += char
        previousChar = char
    }
    return out
}

export default escape
