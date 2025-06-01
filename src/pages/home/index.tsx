import Layout from "./layout";
import PageHome from "./page";
import { hydrate } from "solid-js/web";


export default function Home() { 
    return ( 
        <Layout title="Rafael's Proxy">
            <PageHome />
        </Layout>
    )
}

if (typeof window !== 'undefined') { 
    hydrate(Home, document.querySelector('body') as HTMLElement)
}