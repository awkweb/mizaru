/* eslint-disable jsx-a11y/no-autofocus */
import { FC } from 'react'
import dynamic from 'next/dynamic'

import { useStore } from '@/store'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface Props {}

const Home: FC<Props> = () => {
    const { content, handleChange } = useStore()
    return (
        <div>
            <Editor
                autoFocus
                content={content as JSON}
                onChange={handleChange as Function}
            />
        </div>
    )
}

export default Home
