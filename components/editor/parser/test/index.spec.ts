import Parser from '../'

test('create parser', () => {
    const parser = new Parser()
    expect(parser).toBeDefined()
})

test('converts lines and parses content', () => {
    const lines = ['foo', 'bar', 'baz']
    const content = Parser.toContent(lines)
    expect(content).toMatchInlineSnapshot(`
        "foo
        bar
        baz"
    `)
    const out = Parser.parse(content)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 15,
          "decorations": Array [],
          "nodes": Array [
            Object {
              "from": 0,
              "marks": Array [],
              "to": 15,
              "type": "paragraph",
            },
          ],
        }
    `)
})
