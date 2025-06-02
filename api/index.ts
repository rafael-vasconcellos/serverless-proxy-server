import express, { request, response } from "express";
import handler from "./handler.js";
import cookieParser from 'cookie-parser'
import fs from 'fs'



const app = express();
const expressHandler = async(req: typeof request, res: typeof response) => { 
    const response = await handler(req as any).catch(err => ( 
        new Response(err?.stack ?? err, { status: 500 })
    ))
    response.headers.forEach((value, key) => res.header(key, value))
    res.status(response.status)//.send(await response.blob())

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
app.use(cookieParser())
//app.use('/home', express.static('../public/home'));
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

app.get("/*splat", expressHandler)
app.get("/", expressHandler)

app.listen(3000, () => console.log("Server ready on port 3000."))
export default app
