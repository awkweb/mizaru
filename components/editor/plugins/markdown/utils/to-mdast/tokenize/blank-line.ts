import { Eat } from 'remark-parse'

const reBlankLine = /^[ \t]*(\n|$)/

function blankLine(eat: Eat, value: string, silent: boolean) {
    let match
    let subvalue = ''
    let index = 0
    const length = value.length

    while (index < length) {
        match = reBlankLine.exec(value.slice(index))

        if (match == null) {
            break
        }

        index += match[0].length
        subvalue += match[0]
    }

    if (subvalue === '') {
        return
    }

    if (silent) {
        return true
    }

    eat(subvalue)({ type: 'blankLine', count: index / 2 })
}

export default blankLine
