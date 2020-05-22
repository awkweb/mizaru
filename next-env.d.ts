/// <reference types="next" />
/// <reference types="next/types/global" />

import { Node } from 'unist'

declare module 'unist-util-source' {
    export default function source(node: Node, doc: string): string
}
