import { Delete } from '@/components/editor/marks'

import Markdown from '..'

// @ts-ignore
const { out, backspace, type, mkState, mkSchema } = prosemirror
const { schema, plugins } = mkSchema([new Markdown(), new Delete()])
const { doc, p } = out(schema)
const active = out(schema, {
    mark: { active: true },
})

describe('basic', () => {
    const content = '~~foo~~'
    test(content, () => {
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(doc(p(active.delete(content))))
        state = backspace(state, 3)
        expect(state.doc).toEqual(
            doc(p(content.substring(0, content.length - 2))),
        )
    })
})
