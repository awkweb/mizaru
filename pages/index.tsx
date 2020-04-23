import { FC } from 'react'
import dynamic from 'next/dynamic'

import { useStore } from '@/store'

interface Props {}

const Editor = dynamic(() => import('@/components/editor'), {
    ssr: false,
})

const Home: FC<Props> = () => {
    const { doc, handleSave } = useStore()
    return <Editor doc={doc} onSave={handleSave} />
}

export default Home
