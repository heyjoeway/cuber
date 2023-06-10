export class HistoryVar<Type> {
    _history: Type[] = [];
    _historyLength: number;

    constructor(historyLength: number, initialValue: Type) {
        this._historyLength = historyLength;
        this._history.push(initialValue);
    }

    set(value: Type) {
        this._history.push(value);
        if (this._history.length > this._historyLength) {
            this._history.shift();
        }
    }

    get(): Type {
        return this._history[this._history.length - 1];
    }

    get value(): Type {
        return this.get();
    }

    clearHistory() {
        this._history = [];
    }
}

export class HistoryNumberVar extends HistoryVar<number> {
    getAverageDelta(): number {
        let sum = 0;
        for (let i = 1; i < this._history.length; i++) {
            sum += this._history[i] - this._history[i - 1];
        }
        let result = sum / (this._history.length - 1);
        return result;
    }
}

export function absCap(value: number, cap: number) {
    cap = Math.abs(cap);
    return Math.min(Math.max(value, -cap), cap);
}

export function noNaN(value: number, fallback: number = 0) {
    return isNaN(value) ? fallback : value;
}