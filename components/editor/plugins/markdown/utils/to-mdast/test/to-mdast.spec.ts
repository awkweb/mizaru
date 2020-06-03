import toMDAST from '../'

test('empty', () => {
    const mdast = toMDAST('')
    expect(mdast).toMatchInlineSnapshot(`
        Object {
          "children": Array [],
          "position": Object {
            "end": Object {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
            "start": Object {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "root",
        }
    `)
})

test('plain text', () => {
    const mdast = toMDAST('foo bar baz')
    expect(mdast).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "position": Position {
                    "end": Object {
                      "column": 12,
                      "line": 1,
                      "offset": 11,
                    },
                    "indent": Array [],
                    "start": Object {
                      "column": 1,
                      "line": 1,
                      "offset": 0,
                    },
                  },
                  "type": "text",
                  "value": "foo bar baz",
                },
              ],
              "position": Position {
                "end": Object {
                  "column": 12,
                  "line": 1,
                  "offset": 11,
                },
                "indent": Array [],
                "start": Object {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "paragraph",
            },
          ],
          "position": Object {
            "end": Object {
              "column": 12,
              "line": 1,
              "offset": 11,
            },
            "start": Object {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "root",
        }
    `)
})

test('multi-line text', () => {
    const mdast = toMDAST('foo\n\n\nbar')
    expect(mdast).toMatchInlineSnapshot(`
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "position": Position {
                    "end": Object {
                      "column": 4,
                      "line": 1,
                      "offset": 3,
                    },
                    "indent": Array [],
                    "start": Object {
                      "column": 1,
                      "line": 1,
                      "offset": 0,
                    },
                  },
                  "type": "text",
                  "value": "foo",
                },
              ],
              "position": Position {
                "end": Object {
                  "column": 4,
                  "line": 1,
                  "offset": 3,
                },
                "indent": Array [],
                "start": Object {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "paragraph",
            },
            Object {
              "count": 3,
              "position": Position {
                "end": Object {
                  "column": 1,
                  "line": 7,
                  "offset": 9,
                },
                "indent": Array [
                  1,
                  1,
                  1,
                  1,
                  1,
                  1,
                ],
                "start": Object {
                  "column": 4,
                  "line": 1,
                  "offset": 3,
                },
              },
              "type": "blankLine",
            },
            Object {
              "children": Array [
                Object {
                  "position": Position {
                    "end": Object {
                      "column": 4,
                      "line": 7,
                      "offset": 12,
                    },
                    "indent": Array [],
                    "start": Object {
                      "column": 1,
                      "line": 7,
                      "offset": 9,
                    },
                  },
                  "type": "text",
                  "value": "bar",
                },
              ],
              "position": Position {
                "end": Object {
                  "column": 4,
                  "line": 7,
                  "offset": 12,
                },
                "indent": Array [],
                "start": Object {
                  "column": 1,
                  "line": 7,
                  "offset": 9,
                },
              },
              "type": "paragraph",
            },
          ],
          "position": Object {
            "end": Object {
              "column": 4,
              "line": 7,
              "offset": 12,
            },
            "start": Object {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "root",
        }
    `)
})

test.only('test', () => {
    const mdast = toMDAST('\nfoo\n\n\nbar')
    // const mdast = toMDAST('foo\n**bar\nbaz**')
    // expect(mdast).toMatchInlineSnapshot()
})
