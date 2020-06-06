/* eslint-disable import/default */
import u from 'unist-builder'

import toPMAST from '../'

test('empty', () => {
    const mdast = u('root', [
        u('blockquote', [u('paragraph', [u('syntax', '> ')])]),
    ])
    const pmast = toPMAST(mdast)
    expect(pmast).toMatchInlineSnapshot(`
        Object {
          "content": Array [
            Object {
              "content": Array [
                Object {
                  "content": Array [
                    Object {
                      "text": "> ",
                      "type": "text",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "blockquote",
            },
          ],
          "type": "doc",
        }
    `)
})

for (const syntax of ['>', '> ']) {
    describe(`"${syntax}"`, () => {
        test('single word', () => {
            const mdast = u('root', [
                u('blockquote', [
                    u('paragraph', [u('syntax', syntax), u('text', 'foo')]),
                ]),
            ])
            const pmast = toPMAST(mdast)
            expect(pmast).toMatchSnapshot()
        })

        test('multiple words', () => {
            const mdast = u('root', [
                u('blockquote', [
                    u('paragraph', [
                        u('syntax', syntax),
                        u('text', 'foo bar baz'),
                    ]),
                ]),
            ])
            const pmast = toPMAST(mdast)
            expect(pmast).toMatchSnapshot()
        })

        test('split across multiple lines', () => {
            const mdast = u('root', [
                u('blockquote', [
                    u('paragraph', [u('syntax', syntax), u('text', 'foo')]),
                    u('paragraph', [u('text', 'bar')]),
                    u('paragraph', [u('text', 'baz')]),
                ]),
            ])
            const pmast = toPMAST(mdast)
            expect(pmast).toMatchSnapshot()
        })
    })
}
