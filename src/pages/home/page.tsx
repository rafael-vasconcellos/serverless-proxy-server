import { createEffect } from "solid-js"
import Header from "../../components/Header";



export default function PageHome() { 
    let test: string;
    createEffect(() => console.log('dada'))

    return ( 
        <Header />
    )
}