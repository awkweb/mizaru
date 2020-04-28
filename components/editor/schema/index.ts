import { DOMParser, MarkSpec, NodeSpec, Schema } from 'prosemirror-model'

const doc: NodeSpec = {
    content: 'block+',
}
const paragraph: NodeSpec = {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
        return ['p', 0]
    },
}
const text: NodeSpec = {
    group: 'inline',
}

const bold: MarkSpec = {
    parseDOM: [{ tag: 'strong' }],
    toDOM() {
        return ['strong', 0]
    },
}

const nodes = { doc, paragraph, text }
const marks = { bold }
const schema = new Schema({
    topNode: 'doc',
    nodes,
    marks,
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
