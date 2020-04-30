import { ReactNode, createContext, useState } from 'react'
import { parseCookies, setCookie } from 'nookies'

type State = {
    content: JSON
    searchTerm: string
    handleChange: (content: JSON) => void
    handleSearch: (searchTerm?: string) => void
}
const Context = createContext<Partial<State>>({})

type Props = {
    children: ReactNode
}
const Provider = ({ children }: Props) => {
    const cookies = parseCookies()
    const initialContent = JSON.parse(cookies?.content ?? 'null')
    const [content, setContent] = useState<JSON>(initialContent)
    const [searchTerm, setSearchTerm] = useState<string>('')

    const handleChange = (content: JSON) => {
        setCookie(null, 'content', JSON.stringify(content), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        })
        setContent(content)
    }
    const handleSearch = (searchTerm?: string) => {
        setSearchTerm(searchTerm ?? '')
    }

    return (
        <Context.Provider
            value={{
                content,
                searchTerm,
                handleChange,
                handleSearch,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export default Context
export { Provider }
