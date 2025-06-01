import { renderToString } from 'solid-js/web'
import { createEffect } from "solid-js"


function Home() { 
    createEffect(() => console.log('dada'))

    return ( 
        <h1>Hello world</h1>
    )
}

export default () => {
  return renderToString(Home);
};