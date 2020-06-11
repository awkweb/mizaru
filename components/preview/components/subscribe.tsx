import { FC } from 'react'

import useButtondown from '../hooks/use-buttondown'

interface Props {}

const Subscribe: FC<Props> = () => {
    const {
        email,
        isFocused,
        isLoading,
        message,
        isValid,
        handleBlur,
        handleFocus,
        handleChange,
        handleSubmit,
    } = useButtondown()

    return (
        <>
            <form
                className={`border-b flex pt-2 w-full ${
                    isFocused ? 'border-body' : 'border-syntax'
                }`}
                style={{ paddingBottom: 6 }}
                onSubmit={handleSubmit}
            >
                <input
                    className="bg-transparent outline-none placeholder-body pr-2 flex-1"
                    disabled={isLoading}
                    placeholder="name@example.com"
                    value={email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                />
                <button
                    className="
                        font-medium
                        text-sm
                        text-body
                        hover:text-heading
                        disabled:pointer-events-none
                        disabled:text-syntax
                    "
                    disabled={isLoading || !isValid}
                >
                    {isLoading ? 'Reserving...' : 'Reserve'}
                </button>
            </form>
            {message && (
                <div className="mt-2 text-syntax text-xs">{message}</div>
            )}
        </>
    )
}

export default Subscribe
