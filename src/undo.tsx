import { info, error } from "./messages";

type Action = {
    label: string,
    do: () => void,
    undo: () => void,
};

const undoStack: Action[] = [];
const redoStack: Action[] = [];

export function pushAction(act: Action) {
    act.do();
    undoStack.push(act);
    while (redoStack.length) redoStack.pop();
}

export function undo() {
    const act = undoStack.pop();
    if (act) {
        if (act.label) info(`Undid ${act.label}`);
        act.undo();
        redoStack.push(act);
    } else {
        error('Nothing to undo');
    }
}

export function redo() {
    const act = redoStack.pop();
    if (act) {
        if (act.label) info(`Redid ${act.label}`);
        act.do();
        undoStack.push(act);
    } else {
        error('Nothing to redo');
    }
}