import { Selection } from 'prosemirror-state'

function checkActive(from: number, to: number, selection: Selection) {
    const { from: selectionFrom, to: selectionTo, anchor, head } = selection
    const anchored =
        // @ts-ignore
        (anchor >= from && head <= to) ||
        // @ts-ignore
        (head >= from && anchor <= to)
    return (selectionFrom >= from && selectionTo <= to) || anchored
}

export default checkActive
