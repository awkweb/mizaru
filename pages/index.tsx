/* eslint-disable jsx-a11y/no-autofocus */
import { FormEvent, useRef } from 'react'
import { NextPage } from 'next'

import { Editor, EditorRef } from '@/components'
import { useStore } from '@/hooks'

interface Props {}

const Home: NextPage<Props> = () => {
    const { content, searchTerm, handleChange, handleSearch } = useStore()
    const editorRef: EditorRef = useRef(null)
    const onChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement
        // @ts-ignore
        handleSearch(target.value)
    }

    return (
        <div>
            <input value={searchTerm} onChange={onChange} />
            <Editor
                autoFocus
                ref={editorRef}
                searchTerm={searchTerm}
                value={content as JSON}
                onChange={handleChange as Function}
            />
        </div>
    )
}

export default Home
