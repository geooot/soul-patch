import { Node } from "../resolvers/Page";
export abstract class Operator {
    public abstract hasOperatorAttribute(node?: CheerioElement): boolean;
    public abstract applyOperator(node: Node, $: CheerioStatic): Node[];
}
