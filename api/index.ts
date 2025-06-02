import express from "express";
import handler from "./handler.js";
import fs from 'fs'


const app = express();
//app.use('/home', express.static('../public/home'));
/* app.get('/list', (req, res) => { 
    res.send({ 
        current: fs.readdirSync('./api'),
        parent: fs.readdirSync('../')
    })
}); */
app.get("/*splat", async(req, res) => { 
    const response = await handler(req as any).catch(err => ( 
        new Response(err?.stack ?? err, { status: 500 })
    ))
    res.status(response.status).send(await response.text())
});

app.listen(3000, () => console.log("Server ready on port 3000."));
export default app;
