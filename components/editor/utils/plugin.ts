import Extension from './extension'
import { ExtensionType } from '../types'

class Plugin extends Extension {
    get type() {
        return ExtensionType.Plugin
    }
}

export default Plugin
