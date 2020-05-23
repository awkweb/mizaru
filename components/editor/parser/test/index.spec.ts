import Parser from '../'

test('create parser', () => {
    const parser = new Parser()
    expect(parser).toBeDefined()
})

test('converts lines to parseable content', () => {
    const lines = ['foo', 'bar', 'baz']
    const content = Parser.toContent(lines)
    expect(content).toMatchInlineSnapshot(`
        "foo
        bar
        baz"
    `)
})
