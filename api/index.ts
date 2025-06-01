import express from "express";
import handler from "./handler.js";


const app = express();
app.use('/home', express.static('../public/home'));
app.get("/", handler as any);

app.listen(3000, () => console.log("Server ready on port 3000."));
export default app;
