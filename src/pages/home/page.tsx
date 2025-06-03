import { createEffect } from "solid-js";
import { hydrate } from "solid-js/web";
import Header from "../../components/Header";
import About from "../../components/About";



export default function PageHome() { 
    let test: string;
    createEffect(() => console.log('dada'))

    return ( 
        <>
            <Header />
            <About />
        </>
    )
}

if (typeof window !== 'undefined') { 
    (globalThis as any)._$HY = { events: [], completed: new WeakSet() };
    hydrate(PageHome, document.querySelector('body') as HTMLElement)
}