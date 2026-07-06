export class Deque<T> {
    private data: T[] = [];
    private head = 0;
    pushBack(value: T) {
        this.data.push(value);
    }
    front(): T | undefined {
        return this.data[this.head];
    }
    popFront() {
        this.head++;
        if (this.head > 100 && this.head * 2 > this.data.length) {
            this.data = this.data.slice(this.head);
            this.head = 0;
        }
    }
    size() {
        return this.data.length - this.head;
    }
    isEmpty() {
        return this.size() === 0;
    }
}