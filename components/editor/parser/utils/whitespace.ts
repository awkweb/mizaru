export function getEnclosingWhitespace(text: string) {
    return {
        leading: (text.match(/^(\s+)/) || [])[0],
        trailing: (text.match(/(\s+)$/) || [])[0],
    }
}

export function getHeadingWhitespace(text: string, level: number) {
    const trimmed = text.trim()
    const rawMinusSyntax = trimmed.slice(level + 1, trimmed.length)
    const { leading: inner } = getEnclosingWhitespace(rawMinusSyntax)
    return {
        leading: (text.match(/^(\s+)/) || [])[0],
        inner,
        trailing: (text.match(/((\s*)(\s#*)(\s*))*$/) || [])[0],
    }
}

export function getNewLines(text: string) {
    return text.match(/(\n)/g) || []
}
