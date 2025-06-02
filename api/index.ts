import express, { request, response } from "express";
import handler from "./handler.js";
import fs from 'fs'



const app = express();
const expressHandler = async(req: typeof request, res: typeof response) => { 
    const response = await handler(req as any).catch(err => ( 
        new Response(err?.stack ?? err, { status: 500 })
    ))
    res.header('Content-Security-Policy', "default-src 'self'; connect-src 'self'")
    res.status(response.status).send(await response.text())
}
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
