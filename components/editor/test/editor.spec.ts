import Editor from '../editor'

test('create editor', () => {
    const editor = new Editor()
    expect(editor).toBeDefined()
})

test('check empty content', () => {
    const editor = new Editor({
        content: undefined,
    })
    expect(editor.json).toEqual({
        content: [{ type: 'paragraph' }],
        type: 'doc',
    })
})

test('check string content', () => {
    const editor = new Editor({ content: 'Hello, World!' })
    expect(editor.json).toEqual({
        content: [
            {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Hello, World!' }],
            },
        ],
        type: 'doc',
    })
})

test('check json content', () => {
    const editor = new Editor({
        content: {
            content: [
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Hello, World!' }],
                },
            ],
            type: 'doc',
        },
    })
    expect(editor.json).toEqual({
        content: [
            {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Hello, World!' }],
            },
        ],
        type: 'doc',
    })
})

test('change callback', (done) => {
    const editor = new Editor({
        content: undefined,
        onChange: (c) => {
            expect(c).toEqual({
                content: [
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Hello, World!' }],
                    },
                ],
                type: 'doc',
            })
            done()
        },
    })

    editor.setContent('Hello, World!', true)
})

test('transaction callback', (done) => {
    const editor = new Editor({
        content: undefined,
        onTransaction: (t) => {
            expect(t).toBeDefined()
            done()
        },
    })
    editor.setContent('Hello, World!', true)
})
