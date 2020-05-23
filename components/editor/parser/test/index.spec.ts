import Parser from '../'

test('create parser', () => {
    const parser = new Parser()
    expect(parser).toBeDefined()
})

describe('text', () => {
    test('empty', () => {
        const out = Parser.parse('')
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 0,
              "decorations": Array [],
              "nodes": Array [],
            }
        `)
    })

    test('single word', () => {
        const out = Parser.parse('foo')
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 5,
              "decorations": Array [],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [],
                  "to": 5,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('multiple words', () => {
        const out = Parser.parse('foo bar baz')
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 13,
              "decorations": Array [],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [],
                  "to": 13,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('split across multiple lines', () => {
        const out = Parser.parse('foo\nbar\nbaz')
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
})
