import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

import { Plugin as PluginExtension } from '../utils'

class Highlight extends PluginExtension {
    options: { [key: string]: any }
    results: any[] = []
    searchTerm?: string
    private updating: boolean = false

    constructor(options = {}) {
        super()

        this.options = {
            findClass: 'find',
            searching: false,
            caseSensitive: false,
            disableRegex: true,
            alwaysSearch: false,
            ...options,
        }
    }

    get name() {
        return 'highlight'
    }

    commands() {
        return {
            find: (searchTerm: string) => this.find(searchTerm),
            clearSearch: () => this.clear(),
        }
    }

    get findRegExp() {
        return RegExp(
            this.searchTerm ?? '',
            !this.options.caseSensitive ? 'gui' : 'gu',
        )
    }

    get decorations() {
        return this.results.map((deco) =>
            Decoration.inline(deco.from, deco.to, {
                class: this.options.findClass,
            }),
        )
    }

    private search(doc: ProsemirrorNode) {
        this.results = []
        const mergedTextNodes: { text: string; pos: number }[] = []
        let index = 0

        if (!this.searchTerm) {
            return
        }

        doc.descendants((node, pos) => {
            if (node.isText) {
                if (mergedTextNodes[index]) {
                    mergedTextNodes[index] = {
                        text: mergedTextNodes[index].text + node.text,
                        pos: mergedTextNodes[index].pos,
                    }
                } else {
                    mergedTextNodes[index] = {
                        text: node.text as string,
                        pos,
                    }
                }
            } else {
                index += 1
            }
        })

        mergedTextNodes.forEach(({ text, pos }) => {
            const search = this.findRegExp
            let m
            while ((m = search.exec(text))) {
                if (m[0] === '') {
                    break
                }

                this.results.push({
                    from: pos + m.index,
                    to: pos + m.index + m[0].length,
                })
            }
        })
    }

    find(searchTerm: string) {
        return (state: EditorState, dispatch: any) => {
            this.searchTerm = this.options.disableRegex
                ? searchTerm.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
                : searchTerm

            this.updateView(state, dispatch)
        }
    }

    clear() {
        return (state: EditorState, dispatch: any) => {
            this.searchTerm = undefined

            this.updateView(state, dispatch)
        }
    }

    updateView({ tr }: EditorState, dispatch: any) {
        this.updating = true
        dispatch(tr)
        this.updating = false
    }

    createDeco(doc: ProsemirrorNode) {
        this.search(doc)
        return this.decorations
            ? DecorationSet.create(doc, this.decorations)
            : []
    }

    get plugins() {
        return [
            new Plugin({
                state: {
                    init() {
                        return DecorationSet.empty
                    },
                    apply: (tr, old) => {
                        if (
                            this.updating ||
                            this.options.searching ||
                            (tr.docChanged && this.options.alwaysSearch)
                        ) {
                            return this.createDeco(tr.doc)
                        }

                        if (tr.docChanged) {
                            return old.map(tr.mapping, tr.doc)
                        }

                        return old
                    },
                },
                props: {
                    decorations(state) {
                        // @ts-ignore
                        return this.getState(state)
                    },
                },
            }),
        ]
    }
}

export default Highlight
