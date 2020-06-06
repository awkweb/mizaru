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
    const trailing = (text.match(/((\s*)(\s#*)(\s*))*$/) || [])[0]
    const trimmed = text.slice((leading?.length ?? 0) + level + 1, text.length)
    const { leading: inner } = getEnclosingWhitespace(trimmed)
    return { leading, inner, trailing }
}
