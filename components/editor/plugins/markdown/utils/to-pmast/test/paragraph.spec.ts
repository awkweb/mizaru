/* eslint-disable import/default */
import u from 'unist-builder'

import toPMAST from '../'

test('empty', () => {
    const mdast = u('root', [u('paragraph', [])])
    const pmast = toPMAST(mdast)
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
    const mdast = u('root', [u('paragraph', [u('text', 'foo')])])
    const pmast = toPMAST(mdast)
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
    const mdast = u('root', [u('paragraph', [u('text', 'foo bar baz')])])
    const pmast = toPMAST(mdast)
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
    const mdast = u('root', [
        u('paragraph', [
            u('text', 'foo'),
            u('lineFeed'),
            u('text', 'bar'),
            u('lineFeed'),
            u('text', 'baz'),
        ]),
    ])
    const pmast = toPMAST(mdast)
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
