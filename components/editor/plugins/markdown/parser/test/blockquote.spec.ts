import Parser from '../'

test('empty', () => {
    const doc = '> '
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 2,
          "decorations": Array [
            Object {
              "from": 2,
              "to": 4,
              "type": "syntax",
            },
          ],
          "nodes": Array [
            Object {
              "from": 0,
              "to": 2,
              "type": "blockquote",
            },
          ],
        }
    `)
})

test('single word', () => {
    const doc = '> foo'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 9,
          "decorations": Array [
            Object {
              "from": 2,
              "to": 4,
              "type": "syntax",
            },
          ],
          "nodes": Array [
            Object {
              "from": 1,
              "marks": Array [],
              "to": 8,
              "type": "paragraph",
            },
            Object {
              "from": 0,
              "to": 9,
              "type": "blockquote",
            },
          ],
        }
    `)
})

test('multiple words', () => {
    const doc = '> foo bar baz'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 17,
          "decorations": Array [
            Object {
              "from": 2,
              "to": 4,
              "type": "syntax",
            },
          ],
          "nodes": Array [
            Object {
              "from": 1,
              "marks": Array [],
              "to": 16,
              "type": "paragraph",
            },
            Object {
              "from": 0,
              "to": 17,
              "type": "blockquote",
            },
          ],
        }
    `)
})

test('backslash', () => {
    const doc = '> foo\\ bar baz'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 18,
          "decorations": Array [
            Object {
              "from": 2,
              "to": 4,
              "type": "syntax",
            },
          ],
          "nodes": Array [
            Object {
              "from": 1,
              "marks": Array [],
              "to": 17,
              "type": "paragraph",
            },
            Object {
              "from": 0,
              "to": 18,
              "type": "blockquote",
            },
          ],
        }
    `)
})
