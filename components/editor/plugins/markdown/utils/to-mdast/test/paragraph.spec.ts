import toMDAST from '../'

test('empty', () => {
    const mdast = toMDAST('')
    expect(mdast).toMatchInlineSnapshot(`
        Object {
          "children": Array [],
          "type": "root",
        }
    `)
})

test('single word', () => {
    const mdast = toMDAST('foo')
    expect(mdast).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "type": "text",
                  "value": "foo",
                },
              ],
              "type": "paragraph",
            },
          ],
          "type": "root",
        }
    `)
})

test('multiple words', () => {
    const mdast = toMDAST('foo bar baz')
    expect(mdast).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "type": "text",
                  "value": "foo bar baz",
                },
              ],
              "type": "paragraph",
            },
          ],
          "type": "root",
        }
    `)
})

test('split across multiple lines', () => {
    const mdast = toMDAST('foo\nbar\nbaz')
    expect(mdast).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "type": "text",
                  "value": "foo",
                },
              ],
              "type": "paragraph",
            },
            Object {
              "children": Array [
                Object {
                  "type": "text",
                  "value": "bar",
                },
              ],
              "type": "paragraph",
            },
            Object {
              "children": Array [
                Object {
                  "type": "text",
                  "value": "baz",
                },
              ],
              "type": "paragraph",
            },
          ],
          "type": "root",
        }
    `)
})

describe('whitespace', () => {
    test('leading spaces', () => {
        const mdast = toMDAST('  foo bar baz')
        expect(mdast).toMatchInlineSnapshot(`
            Object {
              "children": Array [
                Object {
                  "children": Array [
                    Object {
                      "type": "text",
                      "value": "  foo bar baz",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "root",
            }
        `)
    })

    test('trailing spaces', () => {
        const mdast = toMDAST('foo bar baz   ')
        expect(mdast).toMatchInlineSnapshot(`
            Object {
              "children": Array [
                Object {
                  "children": Array [
                    Object {
                      "type": "text",
                      "value": "foo bar baz   ",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "root",
            }
        `)
    })

    test('leading blank lines', () => {
        const mdast = toMDAST('\n\n\nfoo bar baz')
        expect(mdast).toMatchInlineSnapshot(`
            Object {
              "children": Array [
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [
                    Object {
                      "type": "text",
                      "value": "foo bar baz",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "root",
            }
        `)
    })

    test('trailing blank lines', () => {
        const mdast = toMDAST('foo bar baz\n\n\n')
        expect(mdast).toMatchInlineSnapshot(`
            Object {
              "children": Array [
                Object {
                  "children": Array [
                    Object {
                      "type": "text",
                      "value": "foo bar baz",
                    },
                  ],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
              ],
              "type": "root",
            }
        `)
    })

    test('inner blank lines', () => {
        const mdast = toMDAST('foo\n\n\nbar\n\n\nbaz')
        expect(mdast).toMatchInlineSnapshot(`
            Object {
              "children": Array [
                Object {
                  "children": Array [
                    Object {
                      "type": "text",
                      "value": "foo",
                    },
                  ],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [
                    Object {
                      "type": "text",
                      "value": "bar",
                    },
                  ],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [
                    Object {
                      "type": "text",
                      "value": "baz",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "root",
            }
        `)
    })
})

describe('nested', () => {})
