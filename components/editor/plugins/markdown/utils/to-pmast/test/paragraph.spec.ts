import toPMAST from '../'

test('empty', () => {
    const pmast = toPMAST({
        type: 'root',
        children: [
            {
                type: 'paragraph',
                children: [],
            },
        ],
    })
    expect(pmast).toMatchInlineSnapshot(`
        Object {
          "content": Array [
            Object {
              "content": Array [],
              "type": "paragraph",
            },
          ],
          "type": "doc",
        }
    `)
})

test('single word', () => {
    const pmast = toPMAST({
        type: 'root',
        children: [
            {
                type: 'paragraph',
                children: [{ type: 'text', value: 'foo' }],
            },
        ],
    })
    expect(pmast).toMatchInlineSnapshot(`
        Object {
          "content": Array [
            Object {
              "content": Array [
                Object {
                  "text": "foo",
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

test('multiple words', () => {
    const pmast = toPMAST({
        type: 'root',
        children: [
            {
                type: 'paragraph',
                children: [{ type: 'text', value: 'foo bar baz' }],
            },
        ],
    })
    expect(pmast).toMatchInlineSnapshot(`
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

test('split across multiple lines', () => {
    const pmast = toPMAST({
        type: 'root',
        children: [
            {
                type: 'paragraph',
                children: [
                    { type: 'text', value: 'foo' },
                    { type: 'lineFeed' },
                    { type: 'text', value: 'bar' },
                    { type: 'lineFeed' },
                    { type: 'text', value: 'baz' },
                ],
            },
        ],
    })
    expect(pmast).toMatchInlineSnapshot(`
        Object {
          "content": Array [
            Object {
              "content": Array [
                Object {
                  "text": "foo",
                  "type": "text",
                },
                Object {
                  "type": "lineFeed",
                },
                Object {
                  "text": "bar",
                  "type": "text",
                },
                Object {
                  "type": "lineFeed",
                },
                Object {
                  "text": "baz",
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

describe('whitespace', () => {})

describe('nested', () => {})
