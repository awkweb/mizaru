import toPMAST from '../'

test('test', () => {
    const pmast = toPMAST({
        type: 'root',
        children: [
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'strong',
                        children: [
                            { type: 'syntax', value: '**' },
                            { type: 'text', value: 'foo' },
                            { type: 'syntax', value: '**' },
                        ],
                    },
                ],
            },
        ],
    })
})
