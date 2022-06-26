declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
        type Element = Compiled;
    }
}

export class Compiled {
    
    constructor(private html: string) {
    }
    
    toString(): string {
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

export function h(tag: string|Function, attributes: {[name: string]: unknown}, ...children: unknown[]): Compiled {
    if (typeof(tag) == "function") {
        return tag(attributes, children);
    }
    let html = "<" + tag;
    for (const key in attributes) {
        const value = attributes[key];
        html += " " + key + "=\"" + escapeAttributeValue(value) + "\"";
    }
    if (children.length > 0) {
        html += ">" + renderChild(children) + "</" + tag + ">";
    }
    else {
        html += isSelfClosingTag(tag) ? " />" : "></" + tag + ">";
    }
    return new Compiled(html);
}

export function Raw(html: string) {
    return new Compiled(html);
}

export function Fragment(_props: unknown, children: unknown[]) {
    return new Compiled(renderChild(children));
}

function renderChild(child: unknown) {
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
    if (child instanceof Compiled) {
        return child.toString();
    }
    throw new Error("Cannot render (type=" + typeof(child) + ") " + child);
}
