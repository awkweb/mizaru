import { Heading } from '@/components/editor/nodes'

import Markdown from '..'

// @ts-ignore
const { out, type, mkState, mkSchema } = prosemirror
const { schema, plugins } = mkSchema([new Heading(), new Markdown()])
const { doc, p } = out(schema)
const active = out(schema, {
    node: { active: true },
})

const mkHeadings = (space?: boolean) => {
    return [1, 2, 3, 4, 5, 6].map((i) => ({
        tag: `h${i}`,
        syntax: `${'#'.repeat(i)}${space ? ' ' : ''}`,
    }))
}

describe('basic', () => {
    const headings = mkHeadings()
    for (let { tag, syntax } of headings) {
        const content = `${syntax} foo`
        test(content, () => {
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(active[tag](content)))
        })
    }
})

describe('edge cases', () => {
    const whiteSpace = '   '
    const headings = mkHeadings(false)
    for (let { tag, syntax } of headings) {
        describe(tag, () => {
            const content = `${syntax}foo`
            test(content, () => {
                let state = mkState({ schema, plugins })
                state = type(state, content)
                expect(state.doc).toEqual(doc(p(content)))
            })

            const content2 = `${syntax}foo${whiteSpace}`
            test(content2, () => {
                let state = mkState({ schema, plugins })
                state = type(state, content2)
                expect(state.doc).toEqual(doc(p(content2)))
            })

            const content3 = `${whiteSpace}${syntax}foo`
            test(content3, () => {
                let state = mkState({ schema, plugins })
                state = type(state, content3)
                expect(state.doc).toEqual(doc(p(content3)))
            })

            const content4 = `${whiteSpace}${syntax}foo${whiteSpace}`
            test(content4, () => {
                let state = mkState({ schema, plugins })
                state = type(state, content4)
                expect(state.doc).toEqual(doc(p(content4)))
            })

            const content5 = `${syntax} foo${whiteSpace}`
            test(content5, () => {
                let state = mkState({ schema, plugins })
                state = type(state, content5)
                expect(state.doc).toEqual(doc(active[tag](content5)))
            })
        })
    }
})
