import { DOMParser, Schema } from 'prosemirror-model'

const schema = new Schema({
    topNode: 'doc',
    nodes: {
        doc: {
            content: 'block+',
        },
        paragraph: {
            content: 'inline*',
            group: 'block',
            parseDOM: [{ tag: 'p' }],
            toDOM() {
                return ['p', 0]
            },
        },
        text: {
            group: 'inline',
        },
    },
    marks: {
        bold: {
            inclusive: false,
            parseDOM: [{ tag: 'strong' }],
            toDOM() {
                return ['strong', 0]
            },
        },
    },
})

function createDocument(content: any, parseOptions = {}) {
    const emptyDocument = {
        type: 'doc',
        content: [{ type: 'paragraph' }],
    }
    switch (typeof content) {
        case 'string': {
            const element = document.createElement('div')
            element.innerHTML = content.trim()
            return DOMParser.fromSchema(schema).parse(element, parseOptions)
        }
        case 'object': {
            try {
                return schema.nodeFromJSON(content)
            } catch (error) {
                console.warn(
                    '[warn]: Invalid content.',
                    'Passed value:',
                    content,
                    'Error:',
                    error,
                )
                return schema.nodeFromJSON(emptyDocument)
            }
        }
        case null:
        default: {
            return schema.nodeFromJSON(emptyDocument)
        }
    }
}

export default schema
export { createDocument }
