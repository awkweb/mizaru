export function getEnclosingWhitespace(text: string) {
    return {
        leading: (text.match(/^(\s+)/) || [])[0],
        trailing: (text.match(/(\s+)$/) || [])[0],
    }
}

export function getHeadingWhitespace(text: string, level: number) {
    const { leading } = getEnclosingWhitespace(text)
    const trailing = (text.match(/((\s*)(\s#*)(\s*))*$/) || [])[0]
    const trimmed = text.slice((leading?.length ?? 0) + level + 1, text.length)
    const { leading: inner } = getEnclosingWhitespace(trimmed)
    return { leading, inner, trailing }
}

export function getBlockquoteWhitespace(text: string) {
    const { leading } = getEnclosingWhitespace(text)
    const trimmed = text.slice((leading?.length ?? 0) + 1, text.length)
    const { leading: inner } = getEnclosingWhitespace(trimmed)
    return { leading, inner }
}

export function getNewLines(text: string) {
    return text.match(/(\n)/g) || []
}
