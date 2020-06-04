import toPMAST from '../'

test('empty', () => {
    const pmast = toPMAST({
        type: 'root',
        children: [
            {
                type: 'paragraph',
                children: [],
            },
        ],
    })
    expect(pmast).toMatchInlineSnapshot(`
        Object {
          "content": Array [
            Object {
              "content": Array [],
              "type": "paragraph",
            },
          ],
          "type": "doc",
        }
    `)
})
