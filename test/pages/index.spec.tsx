import * as React from 'react'
import { render } from '@testing-library/react'

import Index from '@/pages/index'

test('renders index page', () => {
    const { container } = render(<Index />)
    expect(container).toBeDefined()
})
