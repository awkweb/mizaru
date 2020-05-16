import Parser from '../'

test('create parser', () => {
    const parser = new Parser()
    expect(parser).toBeDefined()
})

describe('text', () => {
    let doc = 'foo'
    test(doc, () => {
        const { decorations, nodes } = Parser.parse(doc)
        expect(nodes).toEqual([
            { from: 0, to: 5, type: 'paragraph', marks: [] },
        ])
        expect(decorations).toEqual([])
    })

    test('<empty>', () => {
        const { decorations, nodes } = Parser.parse('')
        expect(nodes).toEqual([])
        expect(decorations).toEqual([])
    })
})
