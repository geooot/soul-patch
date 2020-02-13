import { PREFIX } from "../constants";
import { Node } from "../resolvers/Page";
import { Operator } from "./Operator";

const assignAttrName = PREFIX + "assign";

export class AssignOperator implements Operator {
    public hasOperatorAttribute(node?: CheerioElement): boolean {
        if (!node) return false;
        return (
            node.attribs[assignAttrName] !== null &&
            node.attribs[assignAttrName] !== undefined
        );
    }

    public applyOperator(n: Node, $: CheerioStatic): Node[] {
        const { node, context } = n;

        // console.log("\tassign:", node.tagName, context);

        // get the assign string from attribute
        // ex: <p prefix-assign="text: someVariable, class: someBool ? 'text-green' : 'text-red'"></p>
        const assignString = $(node).attr(assignAttrName);

        if (!assignString) throw new Error("Assign Attribute Not Found");

        // I know, i am sorry.
        // this is why this package is called "part-time-templator"
        const attrs = eval(
            `var a; with(context){ a = {${assignString}}; }; a;`
        ) as { [index: string]: string };

        // assign attributes to nodes
        for (const attr in attrs) {
            if (attr == "innerHTML") {
                // set the innerHTML of node
                $(node).html(attrs[attr]);
            } else if (attr == "text") {
                // set the text of the node
                $(node).text(attrs[attr]);
            } else {
                // base case: set the attribute of the node
                $(node).attr(attr, attrs[attr]);
            }
        }

        delete node.attribs[assignAttrName];

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
