import * as assert from "assert";
import { h, Fragment, Raw } from "../index";
import "q2-test";

it("Template should return a valid html", () => {
    
    function MyComponent(props: {d: number, t: string}) {
        const qqq = "zxczc\"zxcz";
        return (
            <div class="qwe">
                <h1>Abc</h1>
                <div class="ttt" checked dupa zzxc></div>
                <img src={qqq} />
                <img src="/asd/zxc?iop=qwe&ycy=123" />
                <hr />
                &
                w
                &amp;
                &lt;
                {qqq}
                {props.t}
            </div>
        );
    }
    
    function App() {
        return (
            <div class="zxc">
                <MyComponent d={1} t={"asd"} />
                <>
                    <div>Hello</div>
                    qwe&zxc
                    {false}
                    {123}
                    {true}
                    {NaN}
                    {undefined}
                    {null}
                    {[<h1>zxc</h1>, "uq&w", false, 123, null]}
                    {Raw('<i>raw html</i>')}
                </>
            </div>
        );
    }
    
    const expected = `<div class="zxc"><div class="qwe"><h1>Abc</h1><div class="ttt" checked="true" dupa="true" zzxc="true"></div><img src="zxczc&quot;zxcz" /><img src="/asd/zxc?iop=qwe&ycy=123" /><hr />&amp; w &amp; &lt;zxczc&quot;zxczasd</div><div>Hello</div>qwe&amp;zxc123NaN<h1>zxc</h1>uq&amp;w123<i>raw html</i></div>`;
    const output = App().render();
    
    assert(expected === output)
});

interface Context {
    abc: number;
}

it("Should properly use context", () => {
    
    function MyComponent(this: Context, props: {d: number}) {
        return <div>{props.d}<p>{this.abc}</p></div>;
    }
    
    const expected = '<div>678<p>123</p></div>';
    const context: Context = {abc: 123};
    const output = (<MyComponent d={678} />).render(context);
    
    assert(expected === output)
});
