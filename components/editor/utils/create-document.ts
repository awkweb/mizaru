import { Schema } from 'prosemirror-model'

function createDocument(schema: Schema, content: JSON) {
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
        const emptyDocument = {
            type: 'doc',
            content: [{ type: 'paragraph' }],
        }
        return schema.nodeFromJSON(emptyDocument)
    }
}

export default createDocument
