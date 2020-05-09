/* eslint-disable jsx-a11y/no-autofocus */
import { useRef } from 'react'
import { NextPage } from 'next'

import { Editor, EditorRef } from '@/components'
import { useStore } from '@/hooks'

interface Props {}

const Home: NextPage<Props> = () => {
    const { content, searchTerm, handleChange, handleSearch } = useStore()
    const editorRef: EditorRef = useRef(null)

    return (
        <div>
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
