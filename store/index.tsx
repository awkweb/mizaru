import { ReactNode, createContext, useContext, useState } from 'react'
import { parseCookies, setCookie } from 'nookies'

type State = {
    content: string
    searchTerm: string
    handleChange: (content: string) => void
    handleSearch: (searchTerm?: string) => void
}
const Context = createContext<Partial<State>>({})

type Props = {
    children: ReactNode
}
const Provider = ({ children }: Props) => {
    const cookies = parseCookies()
    const initialContent = JSON.parse(cookies?.content ?? 'null')
    console.log(initialContent)
    const [content, setContent] = useState<string>(initialContent)
    const [searchTerm, setSearchTerm] = useState<string>()

    const handleChange = (content: string) => {
        console.log(content, JSON.stringify(content))
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

function useStore() {
    return useContext(Context) as State
}

export default Context
export { Provider, useStore }
export type { State }
