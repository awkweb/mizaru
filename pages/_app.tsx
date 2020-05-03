import { AppProps } from 'next/app'

import '@/styles/styles.css'
import { Provider } from '@/store'

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <Provider>
            <Component {...pageProps} />
        </Provider>
    )
}

export default App
