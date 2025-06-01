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
    hydrate(PageHome, document.querySelector('body') as HTMLElement)
}