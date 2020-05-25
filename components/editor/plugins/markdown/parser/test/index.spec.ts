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

test.only('test', () => {
    // prettier-ignore
    // const escaped = unescape('\\o')
    // console.log('escaped', escaped)
    const content = Parser.toContent(['\\', '', 'foo'])
    const out = Parser.parse(content)
    console.log(out)
})
