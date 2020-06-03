// @ts-ignore
import escapes from 'markdown-escapes'

import { backslash, newLine, settings } from '../constants'

function escape(value: string) {
    let out = ''
    let previousChar
    const allowlist = escapes(settings)
    const denylist = [backslash, newLine]

    for (const char of value) {
        if (
            previousChar === backslash &&
            denylist.indexOf(char) === -1 &&
            allowlist.indexOf(char) !== -1
        ) {
            console.log('escape it', char)
            out += backslash + backslash
        }

        // Markdown strips single new line characters so couple them up
        if (char === newLine) {
            // out += newLine
        }

        out += char
        previousChar = char
    }

    return out
}

export default escape
