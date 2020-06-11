import { NextPage } from 'next'
import Head from 'next/head'

import { Preview } from '@/components'

interface Props {}

const Home: NextPage<Props> = () => {
    return (
        <>
            <Head>
                <title>Mizaru</title>
                <meta
                    content="initial-scale=1.0, width=device-width"
                    name="viewport"
                />
            </Head>
            <Preview />
        </>
    )
}

export default Home
