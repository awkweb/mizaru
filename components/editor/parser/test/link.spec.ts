import Parser from '../'

describe.skip('basic', () => {
    const doc = '[foo]()'
    test(doc, () => {
        const { decorations, nodes } = Parser.parse(doc)
    })

    const doc2 = '[foo](https://example.com)'
    test(doc2, () => {
        const { decorations, nodes } = Parser.parse(doc2)
    })

    const doc3 = ['[foo](https://example.com "bar")'].join('\n')
    test(doc3, () => {
        const { decorations, nodes } = Parser.parse(doc3)
    })
})

describe.skip('autolink', () => {
    const doc = '<https://example.com>'
    test(doc, () => {
        const { decorations, nodes } = Parser.parse(doc)
    })

    const doc2 = 'https://example.com'
    test(doc2, () => {
        const { decorations, nodes } = Parser.parse(doc2)
    })

    const doc3 = 'foo@example.com'
    test(doc3, () => {
        const { decorations, nodes } = Parser.parse(doc3)
    })
})
