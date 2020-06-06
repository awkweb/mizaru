/* eslint-disable import/default */
import u from 'unist-builder'

import toPMAST from '../'

// @ts-ignore
const { mkHeadings } = prosemirror

const headings = mkHeadings()
for (const { tag, syntax } of headings) {
    describe(tag, () => {
        test('empty', () => {
            const mdast = u('root', [
                u('heading', { depth: syntax.length }, [
                    u('syntax', syntax),
                    u('syntax', ' '),
                ]),
            ])
            const pmast = toPMAST(mdast)
            expect(pmast).toMatchSnapshot()
        })

        test('single word', () => {
            const mdast = u('root', [
                u('heading', { depth: syntax.length }, [
                    u('syntax', syntax),
                    u('syntax', ' '),
                    u('text', 'foo'),
                ]),
            ])
            const pmast = toPMAST(mdast)
            expect(pmast).toMatchSnapshot()
        })

        test('multiple words', () => {
            const mdast = u('root', [
                u('heading', { depth: syntax.length }, [
                    u('syntax', syntax),
                    u('syntax', ' '),
                    u('text', 'foo bar baz'),
                ]),
            ])
            const pmast = toPMAST(mdast)
            expect(pmast).toMatchSnapshot()
        })

        test('split across multiple lines', () => {
            const mdast = u('root', [
                u('heading', { depth: syntax.length }, [
                    u('syntax', syntax),
                    u('syntax', ' '),
                    u('text', 'foo'),
                ]),
                u('paragraph', [u('text', 'bar')]),
                u('paragraph', [u('text', 'baz')]),
            ])
            const pmast = toPMAST(mdast)
            expect(pmast).toMatchSnapshot()
        })

        describe('nested', () => {
            test('emphasis', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', syntax),
                        u('syntax', ' '),
                        u('text', 'foo '),
                        u('emphasis', [
                            u('syntax', '*'),
                            u('text', 'bar'),
                            u('syntax', '*'),
                        ]),
                        u('text', ' baz'),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('strong', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', syntax),
                        u('syntax', ' '),
                        u('text', 'foo '),
                        u('strong', [
                            u('syntax', '**'),
                            u('text', 'bar'),
                            u('syntax', '**'),
                        ]),
                        u('text', ' baz'),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })
        })

        describe('whitespace', () => {
            test('leading', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', '   '),
                        u('syntax', syntax),
                        u('syntax', ' '),
                        u('text', 'foo bar baz'),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('trailing', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', syntax),
                        u('syntax', ' '),
                        u('text', 'foo bar baz'),
                        u('syntax', '   '),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('leading and trailing', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', '   '),
                        u('syntax', syntax),
                        u('syntax', ' '),
                        u('text', 'foo bar baz'),
                        u('syntax', '   '),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('inner', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', syntax),
                        u('syntax', '    '),
                        u('text', 'foo bar baz'),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('leading and inner', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', '   '),
                        u('syntax', syntax),
                        u('syntax', '    '),
                        u('text', 'foo bar baz'),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('inner and trailing', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', syntax),
                        u('syntax', '    '),
                        u('text', 'foo bar baz'),
                        u('syntax', '   '),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('leading, inner, and trailing', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', '   '),
                        u('syntax', syntax),
                        u('syntax', '    '),
                        u('text', 'foo bar baz'),
                        u('syntax', '   '),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })
        })

        describe('closing sequence', () => {
            test('same number of syntax characters', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', syntax),
                        u('syntax', ' '),
                        u('text', 'foo bar baz'),
                        u('syntax', ` ${syntax}`),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('different number of syntax characters', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', syntax),
                        u('syntax', ' '),
                        u('text', 'foo bar baz'),
                        u('syntax', ` ${syntax}#`),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('trailing whitespace', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', syntax),
                        u('syntax', ' '),
                        u('text', 'foo bar baz'),
                        u('syntax', ` ${syntax}   `),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('random', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', syntax),
                        u('syntax', ' '),
                        u('text', 'foo bar baz'),
                        u('syntax', ' # ##   #'),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })

            test('random and trailing whitespace', () => {
                const mdast = u('root', [
                    u('heading', { depth: syntax.length }, [
                        u('syntax', syntax),
                        u('syntax', ' '),
                        u('text', 'foo bar baz'),
                        u('syntax', ' # ##   #   '),
                    ]),
                ])
                const pmast = toPMAST(mdast)
                expect(pmast).toMatchSnapshot()
            })
        })
    })
}
