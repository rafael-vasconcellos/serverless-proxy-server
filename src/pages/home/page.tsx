import { createEffect } from "solid-js"
import Header from "../../components/Header";
import { hydrate } from "solid-js/web";



export default function PageHome() { 
    let test: string;
    createEffect(() => console.log('dada'))

    return ( 
        <Header />
    )
}

if (typeof window !== 'undefined') { 
    (globalThis as any)._$HY = { events: [], completed: new WeakSet() };
    hydrate(PageHome, document.querySelector('body') as HTMLElement)
}