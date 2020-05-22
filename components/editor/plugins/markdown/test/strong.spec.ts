import { Emphasis, Strong } from '@/components/editor/marks'

import Markdown from '..'

// @ts-ignore
const { out, backspace, type, mkState, mkSchema } = prosemirror
const { schema, plugins } = mkSchema([
    new Emphasis(),
    new Markdown(),
    new Strong(),
])
const { doc, p, emphasis } = out(schema)
const active = out(schema, {
    mark: { active: true },
})

describe('basic', () => {
    for (const syntax of ['**', '__']) {
        const content = `${syntax}foo${syntax}`
        test(content, () => {
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(active.strong(content))))
            state = backspace(state, 3)
            expect(state.doc).toEqual(
                doc(p(content.substring(0, content.length - 2))),
            )
        })
    }
})

describe('with nested', () => {
    test('emphasis', () => {
        let state = mkState({ schema, plugins })
        state = type(state, '**foo *bar***')
        expect(state.doc).toEqual(
            doc(p(active.strong('**foo ', emphasis('*bar*'), '**'))),
        )
    })
})
