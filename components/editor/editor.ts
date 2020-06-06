import { EditorState, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMParser, Schema } from 'prosemirror-model'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

import { Extension, ExtensionManager, minMax, toMarkdown } from './utils'
import { Doc, Paragraph, Text } from './nodes'
import { Data, FocusPosition } from './types'

interface Events {
    onChange: (data: Data) => void
    onTransaction: (transaction: Transaction) => void
}

interface Props extends Events {
    autoFocus?: boolean
    content: object | string
    element: HTMLDivElement
    extensions: Extension[]
}

class Editor {
    commands: any
    events: Events
    extensionManager: ExtensionManager
    focused: boolean = false
    schema: Schema
    selection = { from: 0, to: 0 }
    view: EditorView<any>

    public static FocusPosition = FocusPosition

    constructor(props?: Partial<Props>) {
        // Set options for editor instance
        const defaultProps = {
            autoFocus: false,
            extensions: [],
            content: null,
            onChange: () => {},
            onTransaction: () => {},
        }
        const options = <Props>{
            ...defaultProps,
            ...props,
        }

        // Build extensions
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

        // Create state and view
        const state = EditorState.create({
            schema,
            doc: this.createDocument(schema, options.content),
            plugins: [...plugins, ...keymaps, keymap(baseKeymap)],
        })
        const view = new EditorView(options.element, {
            state,
            editable: () => true,
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

    get markdown() {
        return toMarkdown(this.state.doc)
    }

    get json() {
        return this.state.doc.toJSON()
    }

    createDocument(schema: Schema, content: object | string) {
        const emptyDocument = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                },
            ],
        }

        if (typeof content === 'object') {
            try {
                return schema.nodeFromJSON(content)
            } catch (error) {
                return schema.nodeFromJSON(emptyDocument)
            }
        }

        if (typeof content === 'string') {
            const element = document.createElement('div')
            element.innerHTML = content
                .split('\n')
                .map((x) => `<p>${x}</p>`)
                .join('')
            const options = { preserveWhitespace: true }
            return DOMParser.fromSchema(schema).parse(element, options)
        }

        return schema.nodeFromJSON(emptyDocument)
    }

    dispatchTransaction(transaction: Transaction) {
        const newState = <EditorState<any>>this.state.apply(transaction)
        this.view.updateState(newState)
        this.selection = {
            from: newState.selection.from,
            to: newState.selection.to,
        }
        this.events.onTransaction(transaction)

        if (!transaction.docChanged || transaction.getMeta('preventUpdate')) {
            return
        }
        this.events.onChange({ json: this.json, markdown: this.markdown })
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
            const { doc } = <EditorState>this.state
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

        this.setSelection(<number>from, <number>to)
        this.view.focus()
    }

    setSelection(from = 0, to = 0) {
        const { doc, tr } = <EditorState<any>>this.state
        const resolvedFrom = minMax(from, 0, doc.content.size)
        const resolvedEnd = minMax(to, 0, doc.content.size)
        const selection = TextSelection.create(doc, resolvedFrom, resolvedEnd)
        const transaction = tr.setSelection(selection)

        this.view.dispatch(transaction)
    }

    setContent(content: object | string, emitUpdate: boolean = false) {
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
