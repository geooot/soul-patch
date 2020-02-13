import { PageFields, Page } from "./Page";
import ncp from "ncp";
import * as fs from "fs";
import * as path from "path";

export interface SiteFields {
    pages: PageFields[];
    staticFolders?: {
        from: string; // "webflow/js/"
        to: string; // "public/js/"
    }[];
    props?: {
        [index: string]: string;
    };
}

export class Site {
    private pages: Page[] = [];
    private staticFolders?: {
        from: string; // "webflow/js/"
        to: string; // "public/js/"
    }[];

    constructor(
        pages: PageFields[],
        staticFolders?: {
            from: string; // "webflow/js/"
            to: string; // "public/js/"
        }[],
        props?: { [index: string]: string }
    ) {
        this.staticFolders = staticFolders;
        for (const page of pages) {
            if (page.props) page.props = { ...props, ...page.props };
            else page.props = { ...props };
            this.pages.push(Page.from(page));
        }
    }

    public static from(site: SiteFields): Site {
        return new Site(site.pages, site.staticFolders, site.props);
    }

    public async render(): Promise<void> {
        const promises = [];
        for (const page of this.pages) {
            promises.push(page.render());
        }
        promises.push(this.copyStaticFiles());
        return Promise.all(promises).then(() => Promise.resolve());
    }

    private async copyStaticFile(file: {
        from: string;
        to: string;
    }): Promise<void> {
        const basename = path.sep + path.basename(file.to);
        await fs.promises.mkdir(file.to.replace(basename, ""), {
            recursive: true
        });
        return new Promise((res, rej) => {
            return ncp(file.from, file.to, err => {
                if (err) {
                    console.error(err);
                    return rej(err);
                }
                return res();
            });
        });
    }

    private async copyStaticFiles(): Promise<void> {
        if (!this.staticFolders) return Promise.resolve();
        const promises = [];
        for (const copyReq of this.staticFolders) {
            promises.push(this.copyStaticFile(copyReq));
        }
        return Promise.all(promises).then(() => Promise.resolve());
    }
}
