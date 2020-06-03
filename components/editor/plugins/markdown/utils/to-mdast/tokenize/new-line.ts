import { Eat } from 'remark-parse'

import { newLine } from '../constants'

function locate(value: string, fromIndex: number) {
    return value.indexOf(newLine, fromIndex)
}

const reNewLine = /^\n/

function tokenize(eat: Eat, value: string, silent: boolean) {
    const match = reNewLine.exec(value)

    if (!match) {
        return
    }

    if (silent) {
        return true
    }

    eat(match[0])({
        type: 'newLine',
    })
}

tokenize.locator = locate

export default tokenize
