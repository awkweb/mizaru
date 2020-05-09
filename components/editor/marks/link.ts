import {
    DOMOutputSpec,
    MarkSpec,
    Mark as ProsemirrorMark,
} from 'prosemirror-model'

import { Plugin } from 'prosemirror-state'

import { Mark, getMarkAttrs } from '../utils'
import { DecorationType, EditorSchema } from '../types'

class Link extends Mark {
    get name() {
        return 'link'
    }

    get schema(): MarkSpec {
        return {
            attrs: {
                active: {
                    default: false,
                },
                href: {
                    default: null,
                },
                title: {
                    default: null,
                },
            },
            parseDOM: [
                {
                    tag: 'a[href]',
                    getAttrs: (dom: string | Node) => ({
                        // @ts-ignore
                        href: dom.getAttribute('href'),
                    }),
                },
            ],
            toDOM: (node: ProsemirrorMark, _inline: boolean): DOMOutputSpec => {
                const { active, ...rest } = node.attrs
                const attrs = {
                    ...(active ? { class: 'active' } : null),
                    ...rest,
                    rel: 'noopener noreferrer nofollow',
                }
                return ['a', attrs]
            },
        }
    }

    plugins({ schema }: { schema: EditorSchema }) {
        return [
            new Plugin({
                props: {
                    handleClick: (view, _pos, event): boolean => {
                        if (!event.metaKey) {
                            return false
                        }

                        const mark = schema.marks.link
                        const attrs = getMarkAttrs(view.state, mark)

                        const target = event.target as HTMLElement
                        const parentIsAnchor =
                            target.parentElement instanceof HTMLAnchorElement
                        const targetIsNotSyntax = !target.classList.contains(
                            DecorationType.Syntax,
                        )

                        if (attrs.href && parentIsAnchor && targetIsNotSyntax) {
                            event.stopPropagation()
                            window.open(attrs.href, '_blank')
                            return true
                        }
                        return false
                    },
                },
            }),
        ]
    }
}

export default Link
