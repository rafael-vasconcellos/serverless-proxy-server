import path from "path";
import { fileURLToPath } from 'url'
import express, { request, response, Router } from "express"
import cookieParser from 'cookie-parser'
import routesHandler, { getHostname } from "./handler.js"
import serverless from "serverless-http"
import fs from 'fs'



const app = express()
const router = Router()
//const dirname = import.meta.url? path.dirname(fileURLToPath(import.meta.url)) : __dirname
const public_path = path.join(process.cwd(), 'public')
const expressHandler = async(req: typeof request, res: typeof response) => { 
    const { hostname } = getHostname(req as any)
    if (!hostname) { 
        if (!req.url.includes('/home')) { res.redirect('/home') }
        return 
    }

    const response = await routesHandler(req as any).catch(err => ( 
        new Response(err?.stack ?? err, { status: 500 })
    ))
    response.headers.forEach((value, key) => res.header(key, value))
    res.status(response.status)


    if (response.headers.get('content-type')?.includes('text')) { 
        const text_code = await response.text()
        const domainName = hostname.replace('www.', '')
        const regexp = new RegExp('(?<==\s*|\"|\')\.' + domainName, 'g')
        let modifiedText = text_code.replaceAll(hostname, req.hostname)
        modifiedText = modifiedText.replaceAll(regexp, req.hostname)
        res.send(modifiedText)
        //console.log(modifiedText)
        return;
    }
    response.body?.pipeTo(
        new WritableStream({
            write(chunk) {
                res.write(chunk)
            },
            close() {
                res.end()
            }
        })
    )
}
router.use(cookieParser())
router.use(express.static(public_path))
/* app.get('/list', (req, res) => { 
    res.send({ 
        current: fs.readdirSync('./api'),
        parent: fs.readdirSync('../')
    })
});
app.get('/ip', async(req, res) => { 
    const response = await fetch('https://api.ipify.org?format=json')
    .catch(err => ( 
        new Response(err?.stack ?? err, { status: 500 })
    ));

    res.status(response.status).send(await response.text())
}); */

router.get("/*splat", expressHandler)
router.get("/", expressHandler)

app.use(router)
app.use('/.netlify/functions/*splat', router)
app.listen(3000, () => console.log("Server ready on port 3000."))
export const handler = serverless(app)
export default app
