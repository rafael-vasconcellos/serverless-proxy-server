import express from "express";
import handler from "./handler.js";
import fs from 'fs'


const app = express();
app.use('/home', express.static('../public/home'));
app.get("/", async(req, res) => { 
    return await handler(req as any).catch(err => ( 
        res.status(500).send({ 
            ...err, 
        })
    )) as any
});
app.get('/list', (req, res) => { 
    res.send({ 
        current: fs.readdirSync('./api')
    })
})

app.listen(3000, () => console.log("Server ready on port 3000."));
export default app;
