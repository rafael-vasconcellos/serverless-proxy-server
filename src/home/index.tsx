import { createEffect } from "solid-js"



export default function Home() { 
    createEffect(() => console.log('dada'))

    return ( 
        <h1>Hello world</h1>
    )
}