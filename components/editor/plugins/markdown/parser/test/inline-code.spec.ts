import Parser from '../'

test('single word', () => {
    const doc = '`foo`'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 7,
          "decorations": Array [
            Object {
              "from": 1,
              "to": 2,
              "type": "syntax",
            },
            Object {
              "from": 5,
              "to": 6,
              "type": "syntax",
            },
          ],
          "nodes": Array [
            Object {
              "from": 0,
              "marks": Array [
                Object {
                  "from": 1,
                  "to": 6,
                  "type": "inlineCode",
                },
              ],
              "to": 7,
              "type": "paragraph",
            },
          ],
        }
    `)
})

test('multiple words', () => {
    const doc = '`foo bar baz`'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 15,
          "decorations": Array [
            Object {
              "from": 1,
              "to": 2,
              "type": "syntax",
            },
            Object {
              "from": 13,
              "to": 14,
              "type": "syntax",
            },
          ],
          "nodes": Array [
            Object {
              "from": 0,
              "marks": Array [
                Object {
                  "from": 1,
                  "to": 14,
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

test('backslash', () => {
    const doc = '`foo\\ bar baz`'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 15.5,
          "decorations": Array [
            Object {
              "from": 1,
              "to": 2,
              "type": "syntax",
            },
            Object {
              "from": 13.5,
              "to": 14.5,
              "type": "syntax",
            },
          ],
          "nodes": Array [
            Object {
              "from": 0,
              "marks": Array [
                Object {
                  "from": 1,
                  "to": 14.5,
                  "type": "inlineCode",
                },
              ],
              "to": 15.5,
              "type": "paragraph",
            },
          ],
        }
    `)
})

test('split across multiple lines', () => {
    const doc = '`foo\nbar\nbaz`'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 17,
          "decorations": Array [
            Object {
              "from": 1,
              "to": 2,
              "type": "syntax",
            },
            Object {
              "from": 15,
              "to": 16,
              "type": "syntax",
            },
          ],
          "nodes": Array [
            Object {
              "from": 0,
              "marks": Array [
                Object {
                  "from": 1,
                  "to": 16,
                  "type": "inlineCode",
                },
              ],
              "to": 17,
              "type": "paragraph",
            },
          ],
        }
    `)
})

describe('with nested', () => {
    test('delete', () => {
        const doc = '`foo ~~bar~~ baz`'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 19,
              "decorations": Array [
                Object {
                  "from": 1,
                  "to": 2,
                  "type": "syntax",
                },
                Object {
                  "from": 17,
                  "to": 18,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 1,
                      "to": 18,
                      "type": "inlineCode",
                    },
                  ],
                  "to": 19,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('emphasis', () => {
        const doc = '`foo *bar* baz`'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 17,
              "decorations": Array [
                Object {
                  "from": 1,
                  "to": 2,
                  "type": "syntax",
                },
                Object {
                  "from": 15,
                  "to": 16,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 1,
                      "to": 16,
                      "type": "inlineCode",
                    },
                  ],
                  "to": 17,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('inlineCode', () => {
        const doc = '`foo `bar` baz`'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 17,
              "decorations": Array [
                Object {
                  "from": 1,
                  "to": 2,
                  "type": "syntax",
                },
                Object {
                  "from": 6,
                  "to": 7,
                  "type": "syntax",
                },
                Object {
                  "from": 10,
                  "to": 11,
                  "type": "syntax",
                },
                Object {
                  "from": 15,
                  "to": 16,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 1,
                      "to": 7,
                      "type": "inlineCode",
                    },
                    Object {
                      "from": 10,
                      "to": 16,
                      "type": "inlineCode",
                    },
                  ],
                  "to": 17,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('strong', () => {
        const doc = '`foo **bar** baz`'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 19,
              "decorations": Array [
                Object {
                  "from": 1,
                  "to": 2,
                  "type": "syntax",
                },
                Object {
                  "from": 17,
                  "to": 18,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 1,
                      "to": 18,
                      "type": "inlineCode",
                    },
                  ],
                  "to": 19,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })
})
