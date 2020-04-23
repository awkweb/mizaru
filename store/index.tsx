import { createContext, useContext, useState } from 'react'
import { schema } from 'prosemirror-schema-basic'

type State = {
    doc: any
    setDoc: Function
    handleSave: Function
}
const Context = createContext<Partial<State>>({})

type Props = {
    children: React.ReactNode
}
const Provider = ({ children }: Props) => {
    const data = JSON.parse(localStorage.getItem('data') ?? 'null')
    const initialDoc = data ? schema.nodeFromJSON(data) : undefined
    const [doc, setDoc] = useState(initialDoc)
    const handleSave = (data: any) => {
        console.log(data)
        localStorage.setItem('data', JSON.stringify(data))
    }
    return (
        <Context.Provider value={{ doc, setDoc, handleSave }}>
            {children}
        </Context.Provider>
    )
}

const useStore = () => useContext(Context)

export default Context
export { Provider, useStore }
