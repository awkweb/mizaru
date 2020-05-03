import {
    DOMOutputSpec,
    MarkType,
    Node as ProsemirrorNode,
} from 'prosemirror-model'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'

import { Decoration, DecorationSet } from 'prosemirror-view'

import { Mark } from '../utils'

type Props = {
    syntaxClass: string
}

const key = new PluginKey('markdown-italic')

class Italic extends Mark {
    props: Props
    matches: { from: number; to: number }[] = []
    private updating: boolean = false

    constructor(props: Partial<Props>) {
        super()

        this.props = {
            syntaxClass: 'syntax',
            ...props,
        }
    }

    get name() {
        return 'italic'
    }

    get schema() {
        return {
            parseDOM: [
                { tag: 'i' },
                { tag: 'em' },
                { style: 'font-style=italic' },
            ],
            toDOM: (): DOMOutputSpec => ['em'],
        }
    }

    get syntaxRegExp() {
        return RegExp(/(\*|_)(.*?)\1/, 'gu')
    }

    get decorations() {
        let decorations: Decoration<any>[] = []
        this.matches.forEach((deco) =>
            decorations.push(
                Decoration.inline(deco.from, deco.from + 1, {
                    class: this.props.syntaxClass,
                }),
                Decoration.inline(deco.from, deco.to, {
                    class: 'italic',
                }),
                Decoration.inline(deco.to - 1, deco.to, {
                    class: this.props.syntaxClass,
                }),
            ),
        )
        return decorations
    }

    private parse(doc: ProsemirrorNode) {
        this.matches = []
        const mergedTextNodes: { text: string; pos: number }[] = []
        let index = 0

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
            const search = this.syntaxRegExp
            let m
            while ((m = search.exec(text))) {
                if (m[0] === '') {
                    break
                }

                this.matches.push({
                    from: pos + m.index,
                    to: pos + m.index + m[0].length,
                })
            }
        })
    }

    createDeco(doc: ProsemirrorNode) {
        this.parse(doc)
        return this.decorations
            ? DecorationSet.create(doc, this.decorations)
            : []
    }

    plugins({ type }: { type: MarkType }) {
        return [
            new Plugin({
                key,
                state: {
                    init: (_: Object, state: EditorState) => {
                        return this.createDeco(state.doc)
                    },
                    apply: (tr, oldState) => {
                        if (this.updating || tr.docChanged) {
                            return this.createDeco(tr.doc)
                        }

                        if (tr.docChanged) {
                            return oldState.map(tr.mapping, tr.doc)
                        }

                        return oldState
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

export default Italic
