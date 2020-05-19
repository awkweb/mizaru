const EMPTY_CHAR = ''
export const WHITESPACE_CHAR = ' '

export function getLeadingWhiteSpace(raw: string) {
    if (!raw.startsWith(WHITESPACE_CHAR)) {
        return EMPTY_CHAR
    }
    const trimmed = raw.trimLeft()
    const whiteSpaceLength = raw.length - trimmed.length
    return WHITESPACE_CHAR.repeat(whiteSpaceLength)
}

export function getTrailingWhiteSpace(raw: string) {
    if (!raw.endsWith(WHITESPACE_CHAR)) {
        return EMPTY_CHAR
    }
    const trimmed = raw.trimRight()
    const whiteSpaceLength = raw.length - trimmed.length
    return WHITESPACE_CHAR.repeat(whiteSpaceLength)
}

export function getInnerWhiteSpace(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed.includes(WHITESPACE_CHAR)) {
        return EMPTY_CHAR
    }

    const firstWhiteSpaceCharIndex = trimmed.indexOf(WHITESPACE_CHAR)
    const lastWhiteSpaceCharIndex = trimmed.lastIndexOf(WHITESPACE_CHAR)
    if (firstWhiteSpaceCharIndex === lastWhiteSpaceCharIndex) {
        return WHITESPACE_CHAR
    }

    const whiteSpace = trimmed.slice(
        firstWhiteSpaceCharIndex,
        lastWhiteSpaceCharIndex + 1,
    )
    return WHITESPACE_CHAR.repeat(whiteSpace.length)
}
