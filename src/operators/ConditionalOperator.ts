import { PREFIX } from "../constants";
import { Node } from "../resolvers/Page";
import { Operator } from "./Operator";

import { VM } from "vm2";

const conditionalAttrName = PREFIX + "render-if";

export class ConditionalOperator implements Operator {
    public hasOperatorAttribute(node?: CheerioElement): boolean {
        if (!node) return false;
        return (
            node.attribs[conditionalAttrName] !== null &&
            node.attribs[conditionalAttrName] !== undefined
        );
    }

    public applyOperator(n: Node, $: CheerioStatic): Node[] {
        const { node, context } = n;

        // console.log("\tassign:", node.tagName, context);

        // get the assign string from attribute
        // ex: <p prefix-if="foo == true"></p>
        const conditionalString = $(node).attr(conditionalAttrName);

        if (!conditionalString) throw new Error("Assign Attribute Not Found");

        const vm = new VM({ sandbox: context });
        const bool = vm.run(conditionalString);

        delete node.attribs[conditionalAttrName];

        if (!bool) {
            $(node).remove();
            return [];
        }

        return node.children
            .filter(elem => elem.type == "tag")
            .map(
                elem =>
                    ({
                        node: elem,
                        context
                    } as Node)
            );
    }
}
