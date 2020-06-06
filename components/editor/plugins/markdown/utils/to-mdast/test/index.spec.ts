import toMDAST from '../'

test('empty', () => {
    const mdast = toMDAST('')
    expect(mdast).toMatchInlineSnapshot(`
        Object {
          "children": Array [],
          "position": Object {
            "end": Object {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
            "start": Object {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "raw": "",
          "type": "root",
        }
    `)
})
