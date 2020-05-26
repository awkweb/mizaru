import Node from './node'

class Doc extends Node {
    get name() {
        return 'doc'
    }

    get schema() {
        return {
            content: 'block+',
        }
    }
}

export default Doc
