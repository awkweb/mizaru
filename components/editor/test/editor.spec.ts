import Editor from '../editor'

test('create editor', () => {
    const editor = new Editor()
    expect(editor).toBeDefined()
})

describe('valid content', () => {
    test('empty', () => {
        const editor = new Editor({
            content: undefined,
        })
        expect(editor.markdown).toMatchInlineSnapshot(`
        "
        "
    `)
        expect(editor.json).toMatchInlineSnapshot(`
        Object {
          "content": Array [
            Object {
              "type": "paragraph",
            },
          ],
          "type": "doc",
        }
    `)
    })

    test('markdown', () => {
        const editor = new Editor({ content: 'foo bar baz' })
        expect(editor.markdown).toMatchInlineSnapshot(`"foo bar baz"`)
        expect(editor.json).toMatchInlineSnapshot(`
        Object {
          "content": Array [
            Object {
              "content": Array [
                Object {
                  "text": "foo bar baz",
                  "type": "text",
                },
              ],
              "type": "paragraph",
            },
          ],
          "type": "doc",
        }
    `)
    })

    test('json', () => {
        const editor = new Editor({
            content: {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'foo bar baz' }],
                    },
                ],
            },
        })
        expect(editor.markdown).toMatchInlineSnapshot(`"foo bar baz"`)
        expect(editor.json).toMatchInlineSnapshot(`
        Object {
          "content": Array [
            Object {
              "content": Array [
                Object {
                  "text": "foo bar baz",
                  "type": "text",
                },
              ],
              "type": "paragraph",
            },
          ],
          "type": "doc",
        }
    `)
    })
})

describe('invalid content', () => {
    test('json', () => {
        const editor = new Editor({ content: { fooBarBaz: true } })
        expect(editor.markdown).toMatchInlineSnapshot(`
            "
            "
        `)
        expect(editor.json).toMatchInlineSnapshot(`
            Object {
              "content": Array [
                Object {
                  "type": "paragraph",
                },
              ],
              "type": "doc",
            }
        `)
    })

    test('HTML', () => {
        const editor = new Editor({ content: '</>' })
        expect(editor.markdown).toMatchInlineSnapshot(`
            "
            "
        `)
        expect(editor.json).toMatchInlineSnapshot(`
            Object {
              "content": Array [
                Object {
                  "type": "paragraph",
                },
              ],
              "type": "doc",
            }
        `)
    })

    test('function', () => {
        const editor = new Editor({ content: () => false })
        expect(editor.markdown).toMatchInlineSnapshot(`
            "
            "
        `)
        expect(editor.json).toMatchInlineSnapshot(`
            Object {
              "content": Array [
                Object {
                  "type": "paragraph",
                },
              ],
              "type": "doc",
            }
        `)
    })

    test('array', () => {
        const editor = new Editor({ content: [] })
        expect(editor.markdown).toMatchInlineSnapshot(`
            "
            "
        `)
        expect(editor.json).toMatchInlineSnapshot(`
            Object {
              "content": Array [
                Object {
                  "type": "paragraph",
                },
              ],
              "type": "doc",
            }
        `)
    })
})

describe('event callbacks', () => {
    test('change', (done) => {
        const editor = new Editor({
            content: undefined,
            onChange: (c) => {
                expect(c).toEqual({
                    json: {
                        type: 'doc',
                        content: [
                            {
                                type: 'paragraph',
                                content: [
                                    { type: 'text', text: 'foo bar baz' },
                                ],
                            },
                        ],
                    },
                    markdown: 'foo bar baz',
                })
                done()
            },
        })

        editor.setContent('foo bar baz', true)
    })

    test('transaction', (done) => {
        const editor = new Editor({
            content: undefined,
            onTransaction: (t) => {
                expect(t).toBeDefined()
                done()
            },
        })
        editor.setContent('foo bar baz', true)
    })
})
