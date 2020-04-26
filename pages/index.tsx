import { FC } from 'react'
import dynamic from 'next/dynamic'

import { useStore } from '@/store'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface Props {}

const Home: FC<Props> = () => {
    const { content, handleChange } = useStore()
    return (
        <div>
            <Editor autofocus content={content} onChange={handleChange} />
        </div>
    )
}

export default Home
