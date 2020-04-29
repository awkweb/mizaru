import { Node } from '../utils'

class Text extends Node {
    get name() {
        return 'text'
    }

    get schema() {
        return {
            group: 'inline',
        }
    }
}

export default Text
