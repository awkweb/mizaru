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

const key = new PluginKey('markdown-bold')

class Bold extends Mark {
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
        return 'bold'
    }

    get schema() {
        return {
            parseDOM: [
                {
                    tag: 'strong',
                },
                {
                    tag: 'b',
                    getAttrs: (node: string | Node) =>
                        (node as HTMLElement).style.fontWeight !== 'normal' &&
                        null,
                },
                {
                    style: 'font-weight',
                    getAttrs: (value: string | Node) =>
                        /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) &&
                        null,
                },
            ],
            toDOM: (): DOMOutputSpec => ['strong'],
        }
    }

    get syntaxRegExp() {
        return RegExp(/(\*\*|__)(.*?)\1/, 'gu')
    }

    get decorations() {
        let decorations: Decoration<any>[] = []
        this.matches.forEach((deco) =>
            decorations.push(
                Decoration.inline(deco.from, deco.from + 2, {
                    class: this.props.syntaxClass,
                }),
                Decoration.inline(deco.from, deco.to, {
                    class: 'font-bold',
                }),
                Decoration.inline(deco.to - 2, deco.to, {
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
                appendTransaction: (_, _oldState, newState) => {
                    const tr = newState.tr
                    // const mark = type.create({})
                    // this.matches.forEach((match) => {
                    //     tr.addMark(match.from, match.to, mark)
                    //     tr.removeStoredMark(mark)
                    // })
                    return tr
                },
            }),
        ]
    }
}

export default Bold
