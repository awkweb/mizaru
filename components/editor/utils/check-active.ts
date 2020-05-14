import { Selection } from 'prosemirror-state'

function checkActive(from: number, to: number, selection: Selection) {
    const { from: selectionFrom, to: selectionTo, anchor, head } = selection
    const anchored =
        (anchor >= from && head <= to) || (head >= from && anchor <= to)
    return (selectionFrom >= from && selectionTo <= to) || anchored
}

export default checkActive
