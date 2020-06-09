export function getLeadingWhitespace(text: string) {
    return (text.match(/^(\s+)/) || [])[0]
}

export function getTrailingWhitespace(text: string) {
    return (text.match(/(\s+)$/) || [])[0]
}

export function getEnclosingWhitespace(text: string) {
    return {
        leading: getLeadingWhitespace(text),
        trailing: getTrailingWhitespace(text),
    }
}

export function getHeadingWhitespace(text: string, level: number) {
    const leading = getLeadingWhitespace(text)
    const minusLeading = text.slice((leading?.length ?? 0) + level, text.length)
    const trailing = (minusLeading.match(/((\s*)(\s#*)(\s*))*$/) || [])[0]
    const minusTrailing = minusLeading.slice(
        0,
        minusLeading.length - (trailing?.length ?? 0),
    )
    const { leading: inner } = getEnclosingWhitespace(minusTrailing)
    return { leading, inner, trailing }
}

export function getBlockquoteWhitespace(text: string) {
    const leading = getLeadingWhitespace(text)
    const trimmed = text.slice((leading?.length ?? 0) + 1, text.length)
    const { leading: inner } = getEnclosingWhitespace(trimmed)
    return { leading, inner }
}
