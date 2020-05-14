import { EditorState, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMParser, Schema } from 'prosemirror-model'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

import { Extension, ExtensionManager, minMax } from './utils'
import { Doc, Paragraph, Text } from './nodes'
import { EditorSchema, EditorSelection, FocusPosition } from './types'

interface Events {
    onChange: (content: JSON) => void
    onTransaction: (transaction: Transaction) => void
}

interface Props extends Events {
    autoFocus?: boolean
    content: JSON | string
    element: HTMLDivElement
    extensions: Extension[]
}

class Editor {
    commands: any
    events: Events
    extensionManager: ExtensionManager
    focused: boolean = false
    schema: EditorSchema
    selection: EditorSelection = { from: 0, to: 0 }
    view: EditorView<any>

    constructor(props?: Partial<Props>) {
        const defaultProps = {
            autoFocus: false,
            extensions: [],
            content: null,
            onChange: () => {},
            onTransaction: () => {},
        }
        const options = {
            ...defaultProps,
            ...props,
        } as Props
        const extensionManager = new ExtensionManager([
            new Doc(),
            new Text(),
            new Paragraph(),
            ...options.extensions,
        ])
        const { nodes, marks, plugins } = extensionManager
        const schema = new Schema({
            nodes,
            marks,
        })
        const keymaps = extensionManager.keymaps({
            schema,
        })

        const state = EditorState.create({
            schema,
            doc: this.createDocument(schema, options.content),
            plugins: [...plugins, ...keymaps, keymap(baseKeymap)],
        })
        const view = new EditorView(options.element, {
            state,
            dispatchTransaction: this.dispatchTransaction.bind(this),
        })
        const commands = extensionManager.commands({ schema, view })

        this.commands = commands
        this.view = view
        this.schema = schema
        this.extensionManager = extensionManager
        this.events = {
            onChange: options.onChange,
            onTransaction: options.onTransaction,
        }

        if (options.autoFocus !== null) {
            this.focus(FocusPosition.End)
        }
    }

    get state() {
        return this.view.state
    }

    get json() {
        return this.state.doc.toJSON() as JSON
    }

    createDocument(schema: EditorSchema, content: JSON | string) {
        const emptyDocument = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                },
            ],
        }
        switch (typeof content) {
            case 'string': {
                const element = document.createElement('div')
                element.innerHTML = (content as string).trim()
                return DOMParser.fromSchema(schema).parse(element)
            }
            case 'object': {
                try {
                    return schema.nodeFromJSON(content as JSON)
                } catch (error) {
                    return schema.nodeFromJSON(emptyDocument)
                }
            }
            case null:
            default: {
                return schema.nodeFromJSON(emptyDocument)
            }
        }
    }

    dispatchTransaction(transaction: Transaction) {
        const newState = this.state.apply(transaction) as EditorState<any>
        this.view.updateState(newState)
        this.selection = {
            from: newState.selection.from,
            to: newState.selection.to,
        }
        this.events.onTransaction(transaction)

        if (!transaction.docChanged || transaction.getMeta('preventUpdate')) {
            return
        }
        this.events.onChange(this.json)
    }

    resolveSelection(position?: FocusPosition | boolean) {
        if (this.selection && position === null) {
            return this.selection
        }

        if (position === FocusPosition.Start || position === true) {
            return {
                from: 0,
                to: 0,
            }
        }

        if (position === FocusPosition.End) {
            const { doc } = this.state as EditorState<any>
            return {
                from: doc.content.size - 1,
                to: doc.content.size - 1,
            }
        }

        return {
            from: position,
            to: position,
        }
    }

    focus(position?: FocusPosition | boolean) {
        if ((this.view.hasFocus() && position === null) || position === false) {
            return
        }

        const { from, to } = this.resolveSelection(position)

        this.setSelection(from as number, to as number)
        this.view.focus()
    }

    setSelection(from = 0, to = 0) {
        const { doc, tr } = this.state as EditorState<any>
        const resolvedFrom = minMax(from, 0, doc.content.size)
        const resolvedEnd = minMax(to, 0, doc.content.size)
        const selection = TextSelection.create(doc, resolvedFrom, resolvedEnd)
        const transaction = tr.setSelection(selection)

        this.view.dispatch(transaction)
    }

    setContent(content: JSON | string, emitUpdate: boolean = false) {
        const { doc, tr } = this.state
        const document = this.createDocument(this.schema, content)
        const selection = TextSelection.create(doc, 0, doc.content.size)
        const transaction = tr
            .setSelection(selection)
            .replaceSelectionWith(document, false)
            .setMeta('preventUpdate', !emitUpdate)

        this.view.dispatch(transaction)
    }

    destroy() {
        this.view.destroy()
    }
}

export default Editor
