import { HighlightCommands } from './highlight'
import { ReactPropsCommands } from './react-props'

export { default as Highlight } from './highlight'
export { default as History } from './history'
export { default as ReactProps } from './react-props'

export type Commands = HighlightCommands & ReactPropsCommands
