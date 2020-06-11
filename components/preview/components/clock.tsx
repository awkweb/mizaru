import { FC } from 'react'

interface Props {}

const Clock: FC<Props> = () => {
    return (
        <time
            className="absolute text-xs"
            style={{ right: '1rem', top: '0.75rem' }}
        >
            15:48
        </time>
    )
}

export default Clock
