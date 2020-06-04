import toMDAST from '../'

test('empty', () => {
    const mdast = toMDAST('')
    expect(mdast).toMatchInlineSnapshot(`
        Object {
          "children": Array [],
          "type": "root",
        }
    `)
})
