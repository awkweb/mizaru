import { Emphasis } from '@/components/editor/marks'

import Markdown from '..'

// @ts-ignore
const { out, backspace, type, mkState, mkSchema } = prosemirror
const { schema, plugins } = mkSchema([new Emphasis(), new Markdown()])
const { doc, p } = out(schema)
const active = out(schema, {
    mark: { active: true },
})

describe('basic', () => {
    for (const syntax of ['*', '_']) {
        const content = `${syntax}foo${syntax}`
        test(content, () => {
            let state = mkState({ schema, plugins })
            state = type(state, content)
            expect(state.doc).toEqual(doc(p(active.emphasis(content))))
            state = backspace(state, 2)
            expect(state.doc).toEqual(
                doc(p(content.substring(0, content.length - 1))),
            )
        })
    }
})
