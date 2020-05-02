import { EditorState, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

import { Extension, ExtensionManager, minMax } from './utils'
import { Doc, Paragraph, Text } from './nodes'
import { EditorSchema, EditorSelection, FocusPosition } from './types'
import { Commands } from './plugins'

interface Events {
    onChange: (content: JSON) => void
    onTransaction: (transaction: Transaction) => void
}

interface Props extends Events {
    autoFocus?: boolean
    extensions: Extension[]
    element: HTMLDivElement
    content: JSON
}

class Editor {
    commands: Commands
    events: Events
    extensionManager: ExtensionManager
    focused: boolean = false
    schema: EditorSchema
    selection: EditorSelection = { from: 0, to: 0 }
    view: EditorView<any>

    constructor(props: Props) {
        const {
            autoFocus,
            extensions,
            element,
            content,
            onChange,
            onTransaction,
        } = props
        const extensionManager = new ExtensionManager([
            new Doc(),
            new Text(),
            new Paragraph(),
            ...extensions,
        ])
        const { nodes, plugins, marks } = extensionManager
        const schema = new Schema({
            nodes,
            marks,
        })
        const keymaps = extensionManager.keymaps({
            schema,
        })

        const state = EditorState.create({
            schema,
            doc: this.createDocument(schema, content),
            plugins: [...plugins, ...keymaps, keymap(baseKeymap)],
        })
        const view = new EditorView(element, {
            state,
            dispatchTransaction: this.dispatchTransaction.bind(this),
        })
        const commands = extensionManager.commands({ schema, view })

        this.commands = commands as Commands
        this.view = view
        this.schema = schema
        this.extensionManager = extensionManager
        this.events = {
            onChange,
            onTransaction,
        }

        if (autoFocus !== null) {
            this.focus(FocusPosition.End)
        }
    }

    get state() {
        return this.view.state
    }

    createDocument(schema: EditorSchema, content: JSON) {
        try {
            return schema.nodeFromJSON(content)
        } catch (error) {
            const emptyDocument = {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                    },
                ],
            }
            return schema.nodeFromJSON(emptyDocument)
        }
    }

    dispatchTransaction(transaction: Transaction) {
        const newState = this.state.apply(transaction) as EditorState<any>
        this.view.updateState(newState)
        this.selection = {
            from: newState.selection.from,
            to: newState.selection.to,
        }
        this.events.onChange(newState.doc.toJSON() as JSON)
        this.events.onTransaction(transaction)
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

    destroy() {
        this.view.destroy()
    }
}

export default Editor
