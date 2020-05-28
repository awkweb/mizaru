import Parser from '../'

test('creates parser', () => {
    const parser = new Parser()
    expect(parser).toBeDefined()
})

test('parses content', () => {
    const content = ['foo', 'bar', 'baz'].join('\n')
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
