import { keymap } from 'prosemirror-keymap'
import { EditorView } from 'prosemirror-view'

import Extension from './extension'
import { EditorSchema, ExtensionType } from '../types'
import Mark from './mark'
import Node from './node'

export default class ExtensionManager {
    extensions: Extension[]

    constructor(extensions: Extension[] = []) {
        this.extensions = extensions
    }

    get nodes() {
        const nodes = this.extensions.filter(
            (extension) => extension.type === ExtensionType.Node,
        ) as Node[]
        return nodes.reduce(
            (nodes, { name, schema }) => ({
                ...nodes,
                [name]: schema,
            }),
            {},
        )
    }

    get marks() {
        const marks = this.extensions.filter(
            (extension) => extension.type === ExtensionType.Mark,
        ) as Mark[]
        return marks.reduce(
            (marks, { name, schema }) => ({
                ...marks,
                [name]: schema,
            }),
            {},
        )
    }

    plugins({ schema }: { schema: EditorSchema<string, string> }) {
        return this.extensions
            .filter((extension) => extension.plugins)
            .map((extension) => {
                const type = [ExtensionType.Mark, ExtensionType.Node].includes(
                    extension.type,
                )
                    ? (schema as { [key: string]: any })[`${extension.type}s`][
                          extension.name
                      ]
                    : undefined
                return extension.plugins({ schema, type })
            })
            .reduce((allPlugins, plugins) => [...allPlugins, ...plugins], [])
    }

    keymaps({ schema }: { schema: EditorSchema<string, string> }) {
        const pluginKeymaps = this.extensions
            .filter((extension) =>
                [ExtensionType.Plugin].includes(extension.type),
            )
            .filter((extension) => extension.keys)
            .map((extension) => extension.keys({ schema }))
        const nodeMarkKeymaps = this.extensions
            .filter((extension) =>
                [ExtensionType.Mark, ExtensionType.Node].includes(
                    extension.type,
                ),
            )
            .filter((extension) => extension.keys)
            .map((extension) =>
                extension.keys({
                    type: (schema as { [key: string]: any })[
                        `${extension.type}s`
                    ][extension.name],
                    schema,
                }),
            )
        return [...pluginKeymaps, ...nodeMarkKeymaps].map((keys) =>
            keymap(keys),
        )
    }

    commands({
        schema,
        view,
    }: {
        schema: EditorSchema<string, string>
        view: EditorView
    }) {
        return this.extensions
            .filter((extension) => extension.commands)
            .reduce((allCommands, extension) => {
                const { name, type } = extension
                const commands: { [key: string]: any } = {}
                // @ts-ignore
                const value = extension.commands({
                    schema,
                    ...([ExtensionType.Mark, ExtensionType.Node].includes(type)
                        ? {
                              type: (schema as { [key: string]: any })[
                                  `${type}s`
                              ][name],
                          }
                        : {}),
                })

                const apply = (cb: Function, attrs: object) => {
                    if (!view.editable) {
                        return false
                    }
                    return cb(attrs)(view.state, view.dispatch, view)
                }

                const handle = (name: string, value: Array<any> | Function) => {
                    if (Array.isArray(value)) {
                        commands[name] = (attrs: any) =>
                            value.forEach((callback) => apply(callback, attrs))
                    } else if (typeof value === 'function') {
                        commands[name] = (attrs: any) => apply(value, attrs)
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
