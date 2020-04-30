import { ReactNode, createContext, useState } from 'react'
import { parseCookies, setCookie } from 'nookies'

type State = {
    content: JSON
    handleChange: (content: JSON) => void
}
const Context = createContext<Partial<State>>({})

type Props = {
    children: ReactNode
}
const Provider = ({ children }: Props) => {
    const cookies = parseCookies()
    const initialContent = JSON.parse(cookies?.content ?? 'null')
    const [content, setContent] = useState<JSON>(initialContent)

    const handleChange = (content: JSON) => {
        setCookie(null, 'content', JSON.stringify(content), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        })
        setContent(content)
    }

    return (
        <Context.Provider value={{ content, handleChange }}>
            {children}
        </Context.Provider>
    )
}

export default Context
export { Provider }
