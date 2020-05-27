import { Plugin } from 'prosemirror-state'
import { keymap } from 'prosemirror-keymap'
import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'

import Extension from './extension'
import { Mark } from '../marks'
import { Node } from '../nodes'

export default class ExtensionManager {
    extensions: Extension[]

    constructor(extensions: Extension[] = []) {
        this.extensions = extensions
    }

    get nodes() {
        return this.extensions
            .filter((extension) => extension.type === Extension.Type.Node)
            .reduce(
                (nodes, node) => ({
                    ...nodes,
                    [node.name]: (<Node>node).schema,
                }),
                {},
            )
    }

    get marks() {
        return this.extensions
            .filter((extension) => extension.type === Extension.Type.Mark)
            .reduce(
                (marks, mark) => ({
                    ...marks,
                    [mark.name]: (<Mark>mark).schema,
                }),
                {},
            )
    }

    get plugins() {
        return this.extensions
            .filter((extension) => extension.plugins)
            .reduce(
                (allPlugins, { plugins }) => [...allPlugins, ...plugins],
                [] as Plugin<any, any>[],
            )
    }

    keymaps({ schema }: { schema: Schema }) {
        const pluginKeymaps = this.extensions
            .filter((extension) =>
                [Extension.Type.Plugin].includes(extension.type),
            )
            .filter((extension) => extension.keys)
            .map((extension) => extension.keys({ schema }))

        const nodeMarkKeymaps = this.extensions
            .filter((extension) =>
                [Extension.Type.Mark, Extension.Type.Node].includes(
                    extension.type,
                ),
            )
            .filter((extension) => extension.keys)
            .map((extension) =>
                extension.keys({
                    type: schema[`${extension.type}s`][extension.name],
                    schema,
                }),
            )

        return [
            ...pluginKeymaps,
            ...nodeMarkKeymaps,
        ].map((keys: Record<string, any>) => keymap(keys))
    }

    commands({ schema, view }: { schema: Schema; view: EditorView }) {
        return this.extensions
            .filter((extension) => extension.commands)
            .reduce((allCommands, extension) => {
                const { name, type } = extension
                const commands: { [key: string]: any } = {}
                const value = extension.commands({
                    schema,
                    ...([Extension.Type.Mark, Extension.Type.Node].includes(
                        type,
                    )
                        ? {
                              type: schema[`${type}s`][name],
                          }
                        : {}),
                })

                const apply = (callback: Function, attrs: object) => {
                    if (!view.editable) {
                        return false
                    }
                    return callback(attrs)(view.state, view.dispatch, view)
                }

                const handle = (name: string, value: Array<any> | Function) => {
                    if (Array.isArray(value)) {
                        commands[name] = (attrs: object) =>
                            value.forEach((callback) => apply(callback, attrs))
                    } else if (typeof value === 'function') {
                        commands[name] = (attrs: object) => apply(value, attrs)
                    }
                }

                if (typeof value === 'object') {
                    Object.entries(value).forEach(
                        ([commandName, commandValue]) => {
                            handle(commandName, commandValue)
                        },
                    )
                } else {
                    handle(name, value)
                }

                return {
                    ...allCommands,
                    ...commands,
                }
            }, {})
    }
}
