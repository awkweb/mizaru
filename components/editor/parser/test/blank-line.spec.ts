import Parser from '../'

test('test', () => {
    const doc = ['__foo__', 'bar', '__baz__'].join('\n')
    const out = Parser.parse(doc)
    console.log(out)
})
