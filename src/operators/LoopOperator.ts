import { PREFIX } from "../constants";
import { Node } from "../resolvers/Page";
import { Operator } from "./Operator";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

import { VM } from "vm2";

const assignAttrName = PREFIX + "for";

export class LoopOperator implements Operator {
    public hasOperatorAttribute(node?: CheerioElement): boolean {
        if (!node) return false;
        return (
            node.attribs[assignAttrName] !== null &&
            node.attribs[assignAttrName] !== undefined
        );
    }

    public applyOperator(n: Node, $: CheerioStatic): Node[] {
        const { node, context } = n;

        // console.log("\tloop:", node.tagName, context);

        // get the assign string from attribute
        // ex: <p prefix-for="let i=0; i<10; i++"></p>
        // or: <p prefix-for="let item in items"></p>
        const loopString = $(node).attr(assignAttrName);

        if (!loopString) throw new Error("Loop Attribute Not Found");

        const parser = acorn.parse(`for(${loopString}){}`);
        const definedVars = [] as string[];
        walk.full(parser as import("estree").Node, (node: any) => {
            if (
                node.type == "VariableDeclarator" &&
                node.id.name &&
                !definedVars.includes(node.id.name)
            ) {
                definedVars.push(node.id.name);
            }
        });

        const contexts = [] as { [index: string]: string }[];
        const __addContext = (obj: { [index: string]: string }): void => {
            contexts.push(obj);
        };

        const vm = new VM({ sandbox: { ...context, __addContext } });

        vm.run(`for(${loopString}){__addContext({${definedVars.join(",")}})}`);

        const children = [] as Node[];
        const ogLength = node.children.length;
        for (let x = 0; x < contexts.length; x++) {
            const childContext = contexts[x];
            for (let y = 0; y < ogLength; y++) {
                let childNode = node.children[y];
                if (x >= 1) {
                    childNode = $(node.children[y]).clone()[0];
                    $(node).append($(childNode));
                }
                if (childNode && childNode.type == "tag") {
                    children.push({
                        node: childNode as CheerioElement,
                        context: { ...context, ...childContext }
                    });
                }
            }
        }
        delete node.attribs[assignAttrName];

        return children;
    }
}
