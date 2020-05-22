import Markdown from '..'

// @ts-ignore
const { out, type, mkState, mkSchema } = prosemirror
const { schema, plugins } = mkSchema([new Markdown()])
const { doc, p } = out(schema)

describe('text', () => {
    let content = 'foo'
    test(content, () => {
        let state = mkState({ schema, plugins })
        state = type(state, content)
        expect(state.doc).toEqual(doc(p(content)))
    })

    test('<empty>', () => {
        let state = mkState({ schema, plugins })
        state = type(state, '')
        expect(state.doc).toEqual(doc(p('')))
    })
})
