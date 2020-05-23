import Parser from '../'

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

test('backslashes', () => {
    const out = Parser.parse('foo\\ bar baz')
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 14,
          "decorations": Array [],
          "nodes": Array [
            Object {
              "from": 0,
              "marks": Array [],
              "to": 14,
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

describe('with nested', () => {
    test('delete', () => {
        const doc = 'foo ~~bar~~ baz'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 17,
              "decorations": Array [
                Object {
                  "from": 5,
                  "to": 7,
                  "type": "syntax",
                },
                Object {
                  "from": 10,
                  "to": 12,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 5,
                      "to": 12,
                      "type": "delete",
                    },
                  ],
                  "to": 17,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('emphasis', () => {
        const doc = 'foo *bar* baz'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 15,
              "decorations": Array [
                Object {
                  "from": 5,
                  "to": 6,
                  "type": "syntax",
                },
                Object {
                  "from": 9,
                  "to": 10,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 5,
                      "to": 10,
                      "type": "emphasis",
                    },
                  ],
                  "to": 15,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('inlineCode', () => {
        const doc = 'foo `bar` baz'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 15,
              "decorations": Array [
                Object {
                  "from": 5,
                  "to": 6,
                  "type": "syntax",
                },
                Object {
                  "from": 9,
                  "to": 10,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 5,
                      "to": 10,
                      "type": "inlineCode",
                    },
                  ],
                  "to": 15,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('strong', () => {
        const doc = 'foo **bar** baz'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 17,
              "decorations": Array [
                Object {
                  "from": 5,
                  "to": 7,
                  "type": "syntax",
                },
                Object {
                  "from": 10,
                  "to": 12,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 5,
                      "to": 12,
                      "type": "strong",
                    },
                  ],
                  "to": 17,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })
})

describe('with whitespace', () => {
    test('leading', () => {
        const doc = '   foo bar baz'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 16,
              "decorations": Array [],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [],
                  "to": 16,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('trailing', () => {
        const doc = 'foo bar baz   '
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 16,
              "decorations": Array [],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [],
                  "to": 16,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })
})
