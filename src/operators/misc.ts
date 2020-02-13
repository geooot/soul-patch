import { AssignOperator } from "./AssignOperator";
import { Operator } from "./Operator";
import { LoopOperator } from "./LoopOperator";
import { ConditionalOperator } from "./ConditionalOperator";

export const getOperators = (): Operator[] => {
    const arr = [] as Operator[];
    arr.push(new ConditionalOperator());
    arr.push(new AssignOperator());
    arr.push(new LoopOperator());
    return arr;
};
