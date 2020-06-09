import { Eat } from 'remark-parse'

import { NodeType } from '../../../types'

const reBlankLine = /^[ \t]*(\n|$)/

function tokenize(eat: Eat, value: string, silent: boolean) {
    let match
    let subvalue = ''
    let values = []
    let index = 0
    const length = value.length

    while (index < length) {
        match = reBlankLine.exec(value.slice(index))

        if (match == null) {
            break
        }

        index += match[0].length
        subvalue += match[0]

        // Save blank line matches
        values.push(match[0])
    }

    if (subvalue === '') {
        return
    }

    if (silent) {
        return true
    }

    eat(subvalue)({ type: NodeType.BlankLine, count: index, values })
}

export default tokenize
