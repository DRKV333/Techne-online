//todo: move into better module
module Techne.Extensions {
    export class LimitedStack<T> {
        private stack: KnockoutObservableArray<T>;

        constructor(private limit: number) {
            this.stack = ko.observableArray<T>([]);
        }

        public push(elem: T) {
            while (this.stack().length >= this.limit) {
                this.stack.pop();
            }

            console.log("pushing", elem, this);
            this.stack.unshift(elem);
        }

        public peek(): T {
            return this.stack()[0];
        }

        public pop(): T {
            console.log("popping", this);
            return this.stack.shift();
        }

        public clear(): void {
            this.stack.removeAll();
        }
    }
}