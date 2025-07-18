import { createEffect } from "solid-js";
import { hydrate } from "solid-js/web";
import Header from "../../components/Header/index.jsx";
import About from "../../components/About/index.jsx";



export default function PageHome() { 
    //createEffect(() => console.log('dada'))

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