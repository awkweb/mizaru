import { FC } from 'react'

import Clock from './components/clock'
import Subscribe from './components/subscribe'

interface Props {}

const Preview: FC<Props> = () => {
    return (
        <>
            <Clock />

            <section className="max-w-md mx-auto pt-32 px-4">
                <header>
                    <aside className="mb-1 text-heading text-lg">見ざる</aside>
                    <h1 className="mb-2 text-heading text-lg">
                        Modeless. Mouseless. Markdown.
                    </h1>
                </header>
                <ul className="mb-16">
                    <li>
                        Mizaru stores and retrieves notes with each key press.
                    </li>
                    <li>Mizaru works using just the keyboard and shortcuts.</li>
                    <li>Mizaru combines Markdown syntax and preview.</li>
                </ul>

                <Subscribe />
            </section>
        </>
    )
}

export default Preview
