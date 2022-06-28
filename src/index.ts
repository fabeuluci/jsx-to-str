declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
        type Element = Renderable;
    }
}

export type FuntionalComponent<T, C = unknown> = (this: C, props: T, children?: unknown[]) => Renderable<C>;

export function renderJsx<T, C = unknown>(page: FuntionalComponent<T, C>, props: T, context: C) {
    return h(page, props as any).render(context);
}

export abstract class Renderable<T = unknown> {
    abstract render(context?: T): string;
}

export class TagResult<T = unknown> extends Renderable <T>{
    
    constructor(public tag: string|Function, public attributes: {[name: string]: unknown}, public children: unknown[]) {
        super();
    }
    
    render(context?: T): string {
        if (typeof(this.tag) == "function") {
            return this.tag.call(context, this.attributes, this.children).render(context);
        }
        let html = "<" + this.tag;
        for (const key in this.attributes) {
            const value = this.attributes[key];
            html += " " + key + "=\"" + escapeAttributeValue(value) + "\"";
        }
        if (this.children.length > 0) {
            html += ">" + renderChild(this.children, context) + "</" + this.tag + ">";
        }
        else {
            html += isSelfClosingTag(this.tag) ? " />" : "></" + this.tag + ">";
        }
        return html;
    }
}

export class FragmentResult<T = unknown> extends Renderable<T> {
    
    constructor(public children: unknown[]) {
        super();
    }
    
    render(context?: T): string {
        return renderChild(this.children, context);
    }
}

export class RawResult<T = unknown> extends Renderable<T> {
    
    constructor(public html: string) {
        super();
    }
    
    render(_context?: T): string {
        return this.html;
    }
}

const SELF_CLOSING_TAGS = ["area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr", "command", "keygen", "menuitem"];

function isSelfClosingTag(tag: string) {
    return SELF_CLOSING_TAGS.includes(tag);
}

const ENTITY_MAP: {[name: string]: string} = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
    "`": "&#x60;",
    "=": "&#x3D;"
};

function escapeHtml(str: unknown): string {
    if (str == null) {
        return "";
    }
    const ss = typeof(str) == "string" ? str : ("" + str);
    return ss.replace(/[&<>"'`=]/g, s => {
        return ENTITY_MAP[s] as string;
    });
}

function escapeAttributeValue(str: unknown): string {
    if (str == null) {
        return "";
    }
    const ss = typeof(str) == "string" ? str : ("" + str);
    return ss.replace(/"/g, "&quot;");
}

export function h(tag: string|Function, attributes: {[name: string]: unknown}, ...children: unknown[]): Renderable {
    return new TagResult(tag, attributes, children);
}

export function Raw(html: string): Renderable {
    return new RawResult(html);
}

export function Fragment(_props: unknown, children: unknown[]): Renderable {
    return new FragmentResult(children);
}

function renderChild(child: unknown, context?: unknown) {
    if (typeof(child) === "number") {
        return child.toString(10);
    }
    if (typeof(child) === "string") {
        return escapeHtml(child);
    }
    if (typeof(child) == "boolean" || child === null || child === undefined) {
        return "";
    }
    if (Array.isArray(child)) {
        let html = "";
        for (const c of child) {
            html += renderChild(c);
        }
        return html;
    }
    if (child instanceof Renderable) {
        return child.render(context);
    }
    throw new Error("Cannot render (type=" + typeof(child) + ") " + child);
}
