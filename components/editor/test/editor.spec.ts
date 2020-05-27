import Editor from '../editor'

test('create editor', () => {
    const editor = new Editor()
    expect(editor).toBeDefined()
})

test('check empty content', () => {
    const editor = new Editor({
        content: undefined,
    })
    expect(editor.markdown).toEqual('')
})

test('check markdown content', () => {
    const editor = new Editor({ content: 'foo bar baz' })
    expect(editor.markdown).toEqual('foo bar baz')
})

test('change callback', (done) => {
    const editor = new Editor({
        content: undefined,
        onChange: (c) => {
            expect(c).toEqual('foo bar baz')
            done()
        },
    })

    editor.setContent('foo bar baz', true)
})

test('transaction callback', (done) => {
    const editor = new Editor({
        content: undefined,
        onTransaction: (t) => {
            expect(t).toBeDefined()
            done()
        },
    })
    editor.setContent('foo bar baz', true)
})
