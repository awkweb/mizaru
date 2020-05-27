/* eslint-disable jsx-a11y/no-autofocus */
import { useRef } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'

import { Editor, EditorRef } from '@/components'
import { useStore } from '@/store'

interface Props {}

const Home: NextPage<Props> = () => {
    const { content, handleChange } = useStore()
    const editorRef: EditorRef = useRef(null)

    return (
        <>
            <Head>
                <title>Mizaru</title>
                <meta
                    content="initial-scale=1.0, width=device-width"
                    name="viewport"
                />
            </Head>
            <Editor
                autoFocus
                ref={editorRef}
                value={content}
                onChange={handleChange}
            />
        </>
    )
}

export default Home
