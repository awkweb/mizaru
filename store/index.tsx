import { ReactNode, createContext, useContext, useState } from 'react'
import { parseCookies, setCookie } from 'nookies'

type State = {
    content: any
    setContent: Function
    handleChange: Function
}
const Context = createContext<Partial<State>>({})

type Props = {
    children: ReactNode
}
const Provider = ({ children }: Props) => {
    const cookies = parseCookies()
    const initialContent = JSON.parse(cookies?.content ?? 'null')
    const [content, setContent] = useState(initialContent)

    function handleChange(content: JSON) {
        setCookie(null, 'content', JSON.stringify(content), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        })
    }

    return (
        <Context.Provider value={{ content, setContent, handleChange }}>
            {children}
        </Context.Provider>
    )
}

const useStore = () => useContext(Context)

export default Context
export { Provider, useStore }
