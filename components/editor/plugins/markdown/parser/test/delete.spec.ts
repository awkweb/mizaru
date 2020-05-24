import Parser from '../'

test('single word', () => {
    const doc = '~~foo~~'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 9,
          "decorations": Array [
            Object {
              "from": 1,
              "to": 3,
              "type": "syntax",
            },
            Object {
              "from": 6,
              "to": 8,
              "type": "syntax",
            },
          ],
          "nodes": Array [
            Object {
              "from": 0,
              "marks": Array [
                Object {
                  "from": 1,
                  "to": 8,
                  "type": "delete",
                },
              ],
              "to": 9,
              "type": "paragraph",
            },
          ],
        }
    `)
})

test('multiple words', () => {
    const doc = '~~foo bar baz~~'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 17,
          "decorations": Array [
            Object {
              "from": 1,
              "to": 3,
              "type": "syntax",
            },
            Object {
              "from": 14,
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

test('backslash', () => {
    const doc = '~~foo\\ bar baz~~'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 18,
          "decorations": Array [
            Object {
              "from": 1,
              "to": 3,
              "type": "syntax",
            },
            Object {
              "from": 15,
              "to": 17,
              "type": "syntax",
            },
          ],
          "nodes": Array [
            Object {
              "from": 0,
              "marks": Array [
                Object {
                  "from": 1,
                  "to": 17,
                  "type": "delete",
                },
              ],
              "to": 18,
              "type": "paragraph",
            },
          ],
        }
    `)
})

test('split across multiple lines', () => {
    const doc = '~~foo\nbar\nbaz~~'
    const out = Parser.parse(doc)
    expect(out).toMatchInlineSnapshot(`
        Object {
          "counter": 19,
          "decorations": Array [
            Object {
              "from": 1,
              "to": 3,
              "type": "syntax",
            },
            Object {
              "from": 16,
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
                  "type": "delete",
                },
              ],
              "to": 19,
              "type": "paragraph",
            },
          ],
        }
    `)
})

describe('with nested', () => {
    test('delete', () => {
        const doc = '~~foo ~~bar~~ baz~~'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 21,
              "decorations": Array [
                Object {
                  "from": 1,
                  "to": 3,
                  "type": "syntax",
                },
                Object {
                  "from": 12,
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
                      "type": "delete",
                    },
                  ],
                  "to": 21,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('emphasis', () => {
        const doc = '~~foo *bar* baz~~'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 19,
              "decorations": Array [
                Object {
                  "from": 7,
                  "to": 8,
                  "type": "syntax",
                },
                Object {
                  "from": 11,
                  "to": 12,
                  "type": "syntax",
                },
                Object {
                  "from": 1,
                  "to": 3,
                  "type": "syntax",
                },
                Object {
                  "from": 16,
                  "to": 18,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 7,
                      "to": 12,
                      "type": "emphasis",
                    },
                    Object {
                      "from": 1,
                      "to": 18,
                      "type": "delete",
                    },
                  ],
                  "to": 19,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('inlineCode', () => {
        const doc = '~~foo `bar` baz~~'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 19,
              "decorations": Array [
                Object {
                  "from": 7,
                  "to": 8,
                  "type": "syntax",
                },
                Object {
                  "from": 11,
                  "to": 12,
                  "type": "syntax",
                },
                Object {
                  "from": 1,
                  "to": 3,
                  "type": "syntax",
                },
                Object {
                  "from": 16,
                  "to": 18,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 7,
                      "to": 12,
                      "type": "inlineCode",
                    },
                    Object {
                      "from": 1,
                      "to": 18,
                      "type": "delete",
                    },
                  ],
                  "to": 19,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })

    test('strong', () => {
        const doc = '~~foo **bar** baz~~'
        const out = Parser.parse(doc)
        expect(out).toMatchInlineSnapshot(`
            Object {
              "counter": 21,
              "decorations": Array [
                Object {
                  "from": 7,
                  "to": 9,
                  "type": "syntax",
                },
                Object {
                  "from": 12,
                  "to": 14,
                  "type": "syntax",
                },
                Object {
                  "from": 1,
                  "to": 3,
                  "type": "syntax",
                },
                Object {
                  "from": 18,
                  "to": 20,
                  "type": "syntax",
                },
              ],
              "nodes": Array [
                Object {
                  "from": 0,
                  "marks": Array [
                    Object {
                      "from": 7,
                      "to": 14,
                      "type": "strong",
                    },
                    Object {
                      "from": 1,
                      "to": 20,
                      "type": "delete",
                    },
                  ],
                  "to": 21,
                  "type": "paragraph",
                },
              ],
            }
        `)
    })
})
