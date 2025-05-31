import { createEffect } from "solid-js"



export default function PageHome() { 
    let test: string;
    createEffect(() => console.log('dada'))

    return ( 
        <h1>Hello world</h1>
    )
}