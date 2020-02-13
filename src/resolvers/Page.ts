import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import { getOperators } from "../operators";

export interface PageFields {
    inputFile: string; // ex: "src/somepage.html"
    route?: string;
    outputFile?: string; // ex: "public/somepage.html"
    props?: {
        [index: string]: string;
    };
}

export interface Node {
    node: CheerioElement;
    context: {
        [index: string]: string;
    };
}

export class Page {
    private inputFile: string; // ex: "src/somepage.html"
    private outputFile?: string; // ex: "public/somepage.html"
    private props?: {
        [index: string]: string;
    };

    constructor(
        inputFile: string,
        outputFile?: string,
        props?: { [index: string]: string }
    ) {
        this.inputFile = inputFile;
        this.outputFile = outputFile;
        this.props = props;
    }

    public static from(pageObj: PageFields): Page {
        return new Page(pageObj.inputFile, pageObj.outputFile, pageObj.props);
    }

    public async render(): Promise<void> {
        const templateString = await this.readInputFile();
        const $ = cheerio.load(templateString);

        if ($.root().length <= 0) {
            throw new Error("No root HTML node in inputfile");
        }

        this.iterateNodes($.root()[0], $);

        return this.writeToOutputFile($.html());
    }

    private iterateNodes(root: CheerioElement, $: CheerioStatic): void {
        const nodeQueue = [];

        const operators = getOperators();

        const initialNode = {
            node: root,
            context: { ...this.props }
        } as Node;

        // add the initial HTML node to queue
        nodeQueue.push(initialNode);

        // BFS loop
        while (nodeQueue.length > 0) {
            const currNode = nodeQueue.shift();

            if (!currNode) break;
            // console.log("checking node", currNode.node.name);

            let childNodes = [] as Node[];

            if (currNode.node.children)
                childNodes = currNode.node.children
                    .filter(elem => elem.type == "tag")
                    .map(elem => ({
                        node: elem,
                        context: currNode.context
                    }));

            // check if node requires operators to do work on it, then perform operators
            for (const operator of operators) {
                if (operator.hasOperatorAttribute(currNode.node)) {
                    // operators can modify the context for the child nodes
                    childNodes = operator.applyOperator(currNode, $);
                }
            }

            for (const childNode of childNodes) {
                nodeQueue.push(childNode);
            }
        }
    }

    private async readInputFile(): Promise<string> {
        return fs.promises
            .readFile(this.inputFile)
            .then(data => data.toString());
    }

    private async writeToOutputFile(data: any): Promise<void> {
        if (!this.outputFile) return Promise.resolve();
        const basename = path.sep + path.basename(this.outputFile);
        await fs.promises.mkdir(this.outputFile.replace(basename, ""), {
            recursive: true
        });
        return fs.promises.writeFile(this.outputFile, data);
    }
}
