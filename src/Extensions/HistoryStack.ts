//todo: move into better module
module Techne.Extensions {
    export class HistoryStack extends LimitedStack<Models.IHistoryModel> {

        constructor(limit: number) {
            super(limit);
        }

        public push(elem: Models.IHistoryModel) {
            //don't need this, the check is already done in knockoutextender
            if (elem.new == elem.old && elem.new != null && elem.new != undefined) {
                return;
            }

            var peek = this.peek();

            // if this we are modifying the same property
            if (peek &&
                peek.element == elem.element &&
                //peek.old != elem.new &&
                peek.element != null &&
                peek.element != undefined &&
                (   !peek.propertyChain ||
                    (
                        peek.propertyChain.length == elem.propertyChain.length &&
                        !peek.propertyChain.some((v: string, i: number) => {
                            return peek.propertyChain[i] != elem.propertyChain[i]
                    }))
                )
                ) {
                peek.new = elem.new;
            // if this is part of the same action (eg changing parents. that's a removal, followed by an addition)
            } else if (
                peek &&
                peek.element == elem.element &&
                peek.actionType == Models.HistoryAction.Removed &&
                elem.actionType == Models.HistoryAction.Added
            ) {
                var oldTarget = peek.target;
                peek.target = (() => {
                    var order = false;

                    return (e) => {
                        if (order) {
                            oldTarget(e);
                            elem.target(e);
                        } else {
                            elem.target(e);
                            oldTarget(e);
                        }

                        order = !order;
                    }
                    
                })();
                peek.actionType = Models.HistoryAction.ParentChanged;
                this.pop();
                this.push(peek);
            } else {
                super.push(elem);
            }
        }
    }
}