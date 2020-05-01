/* eslint-disable jsx-a11y/no-autofocus */
import { FormEvent, useEffect, useRef } from 'react'
import { NextPage } from 'next'

import { Editor, EditorRef } from '@/components'
import { useStore } from '@/hooks'

interface Props {}

const Home: NextPage<Props> = () => {
    const { content, searchTerm, handleChange, handleSearch } = useStore()
    const editorRef: EditorRef = useRef(null)
    const onChange = (event: FormEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value
        handleSearch(value)
    }

    useEffect(() => {
        editorRef.current?.updateInternalProps({
            searchTerm,
        })
    }, [searchTerm])

    return (
        <div>
            <input
                className="mb-2 pt-1 px-3"
                placeholder="Search"
                value={searchTerm ?? ''}
                onChange={onChange}
            />
            <Editor
                autoFocus
                ref={editorRef}
                searchTerm={searchTerm}
                value={content}
                onChange={handleChange}
            />
        </div>
    )
}

export default Home
