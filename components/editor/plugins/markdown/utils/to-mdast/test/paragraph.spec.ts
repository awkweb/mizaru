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
          "raw": "",
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
                  "raw": "foo",
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
              "raw": "foo",
              "type": "paragraph",
            },
          ],
          "position": Object {
            "end": Object {
              "column": 4,
              "line": 1,
              "offset": 3,
            },
            "start": Object {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "raw": "foo",
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
                  "raw": "foo bar baz",
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
              "raw": "foo bar baz",
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
          "raw": "foo bar baz",
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
                  "raw": "foo",
                  "type": "text",
                  "value": "foo",
                },
              ],
              "type": "paragraph",
            },
            Object {
              "children": Array [
                Object {
                  "position": Position {
                    "end": Object {
                      "column": 4,
                      "line": 2,
                      "offset": 7,
                    },
                    "indent": Array [],
                    "start": Object {
                      "column": 1,
                      "line": 2,
                      "offset": 4,
                    },
                  },
                  "raw": "bar",
                  "type": "text",
                  "value": "bar",
                },
              ],
              "type": "paragraph",
            },
            Object {
              "children": Array [
                Object {
                  "position": Position {
                    "end": Object {
                      "column": 4,
                      "line": 3,
                      "offset": 11,
                    },
                    "indent": Array [],
                    "start": Object {
                      "column": 1,
                      "line": 3,
                      "offset": 8,
                    },
                  },
                  "raw": "baz",
                  "type": "text",
                  "value": "baz",
                },
              ],
              "type": "paragraph",
            },
          ],
          "position": Object {
            "end": Object {
              "column": 4,
              "line": 3,
              "offset": 11,
            },
            "start": Object {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "raw": "foo
        bar
        baz",
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
                      "position": Position {
                        "end": Object {
                          "column": 14,
                          "line": 1,
                          "offset": 13,
                        },
                        "indent": Array [],
                        "start": Object {
                          "column": 1,
                          "line": 1,
                          "offset": 0,
                        },
                      },
                      "raw": "  foo bar baz",
                      "type": "text",
                      "value": "  foo bar baz",
                    },
                  ],
                  "position": Position {
                    "end": Object {
                      "column": 14,
                      "line": 1,
                      "offset": 13,
                    },
                    "indent": Array [],
                    "start": Object {
                      "column": 1,
                      "line": 1,
                      "offset": 0,
                    },
                  },
                  "raw": "  foo bar baz",
                  "type": "paragraph",
                },
              ],
              "position": Object {
                "end": Object {
                  "column": 14,
                  "line": 1,
                  "offset": 13,
                },
                "start": Object {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "raw": "  foo bar baz",
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
                      "position": Position {
                        "end": Object {
                          "column": 15,
                          "line": 1,
                          "offset": 14,
                        },
                        "indent": Array [],
                        "start": Object {
                          "column": 1,
                          "line": 1,
                          "offset": 0,
                        },
                      },
                      "raw": "foo bar baz   ",
                      "type": "text",
                      "value": "foo bar baz   ",
                    },
                  ],
                  "position": Position {
                    "end": Object {
                      "column": 15,
                      "line": 1,
                      "offset": 14,
                    },
                    "indent": Array [],
                    "start": Object {
                      "column": 1,
                      "line": 1,
                      "offset": 0,
                    },
                  },
                  "raw": "foo bar baz   ",
                  "type": "paragraph",
                },
              ],
              "position": Object {
                "end": Object {
                  "column": 15,
                  "line": 1,
                  "offset": 14,
                },
                "start": Object {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "raw": "foo bar baz   ",
              "type": "root",
            }
        `)
    })

    test('blank lines', () => {
        const mdast = toMDAST('\n\n\n\n\n\n')
        expect(mdast).toMatchInlineSnapshot(`
            Object {
              "children": Array [
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
              ],
              "position": Object {
                "end": Object {
                  "column": 1,
                  "line": 7,
                  "offset": 6,
                },
                "start": Object {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "raw": "





            ",
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
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [
                    Object {
                      "position": Position {
                        "end": Object {
                          "column": 12,
                          "line": 4,
                          "offset": 14,
                        },
                        "indent": Array [],
                        "start": Object {
                          "column": 1,
                          "line": 4,
                          "offset": 3,
                        },
                      },
                      "raw": "foo bar baz",
                      "type": "text",
                      "value": "foo bar baz",
                    },
                  ],
                  "position": Position {
                    "end": Object {
                      "column": 12,
                      "line": 4,
                      "offset": 14,
                    },
                    "indent": Array [],
                    "start": Object {
                      "column": 1,
                      "line": 4,
                      "offset": 3,
                    },
                  },
                  "raw": "foo bar baz",
                  "type": "paragraph",
                },
              ],
              "position": Object {
                "end": Object {
                  "column": 12,
                  "line": 4,
                  "offset": 14,
                },
                "start": Object {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "raw": "


            foo bar baz",
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
                      "raw": "foo bar baz",
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
                  "raw": "foo bar baz",
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
              ],
              "position": Object {
                "end": Object {
                  "column": 1,
                  "line": 4,
                  "offset": 14,
                },
                "start": Object {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "raw": "foo bar baz


            ",
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
                      "raw": "foo",
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
                  "raw": "foo",
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [
                    Object {
                      "position": Position {
                        "end": Object {
                          "column": 4,
                          "line": 4,
                          "offset": 9,
                        },
                        "indent": Array [],
                        "start": Object {
                          "column": 1,
                          "line": 4,
                          "offset": 6,
                        },
                      },
                      "raw": "bar",
                      "type": "text",
                      "value": "bar",
                    },
                  ],
                  "position": Position {
                    "end": Object {
                      "column": 4,
                      "line": 4,
                      "offset": 9,
                    },
                    "indent": Array [],
                    "start": Object {
                      "column": 1,
                      "line": 4,
                      "offset": 6,
                    },
                  },
                  "raw": "bar",
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [
                    Object {
                      "position": Position {
                        "end": Object {
                          "column": 4,
                          "line": 7,
                          "offset": 15,
                        },
                        "indent": Array [],
                        "start": Object {
                          "column": 1,
                          "line": 7,
                          "offset": 12,
                        },
                      },
                      "raw": "baz",
                      "type": "text",
                      "value": "baz",
                    },
                  ],
                  "position": Position {
                    "end": Object {
                      "column": 4,
                      "line": 7,
                      "offset": 15,
                    },
                    "indent": Array [],
                    "start": Object {
                      "column": 1,
                      "line": 7,
                      "offset": 12,
                    },
                  },
                  "raw": "baz",
                  "type": "paragraph",
                },
              ],
              "position": Object {
                "end": Object {
                  "column": 4,
                  "line": 7,
                  "offset": 15,
                },
                "start": Object {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "raw": "foo


            bar


            baz",
              "type": "root",
            }
        `)
    })

    test('blank lines with spaces', () => {
        const mdast = toMDAST(' \n   \n\n \n  \n\n')
        expect(mdast).toMatchInlineSnapshot(`
            Object {
              "children": Array [
                Object {
                  "children": Array [
                    Object {
                      "type": "text",
                      "value": " ",
                    },
                  ],
                  "type": "paragraph",
                },
                Object {
                  "children": Array [
                    Object {
                      "raw": null,
                      "type": "text",
                      "value": "   ",
                    },
                  ],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [
                    Object {
                      "raw": null,
                      "type": "text",
                      "value": " ",
                    },
                  ],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [
                    Object {
                      "raw": null,
                      "type": "text",
                      "value": "  ",
                    },
                  ],
                  "raw": null,
                  "type": "paragraph",
                },
                Object {
                  "children": Array [],
                  "raw": null,
                  "type": "paragraph",
                },
              ],
              "position": Object {
                "end": Object {
                  "column": 1,
                  "line": 7,
                  "offset": 13,
                },
                "start": Object {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "raw": " 
               

             
              

            ",
              "type": "root",
            }
        `)
    })
})

describe('nested', () => {})
