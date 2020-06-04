import { Eat } from 'remark-parse'

import { NodeType } from '../../../types'
import { lineFeed } from '../constants'

function locate(value: string, fromIndex: number) {
    return value.indexOf(lineFeed, fromIndex)
}

const reLineFeed = /^\n/

function tokenize(eat: Eat, value: string, silent: boolean) {
    const match = reLineFeed.exec(value)

    if (!match) {
        return
    }

    if (silent) {
        return true
    }

    eat(match[0])({
        type: NodeType.LineFeed,
    })
}

tokenize.locator = locate

export default tokenize
