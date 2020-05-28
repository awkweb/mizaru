// @ts-ignore
import escapes from 'markdown-escapes'

import { settings } from '../constants'

const backslash = '\\'

function unescape(value: string) {
    var previous = 0
    var index = value.indexOf(backslash)
    var queue = []
    var character
    const escape = escapes(settings)

    while (index !== -1) {
        queue.push(value.slice(previous, index))
        previous = index + 1
        character = value.charAt(previous)

        // If the following character is not a valid escape, add the slash.
        if (!character || escape.indexOf(character) === -1) {
            queue.push(backslash)
        }

        index = value.indexOf(backslash, previous + 1)
    }

    queue.push(value.slice(previous))

    return queue.join('')
}

export default unescape
