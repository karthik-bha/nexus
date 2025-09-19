import express, { json } from "express"
import cors from "cors"

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

const arr = [];

app.get("/", (req, res) => {
    res.send("welcome to backend");
})

app.post("/sign-up", (req, res) => {
   const details = req.body;
   arr.push(details);
   res.send("Thanks for the personal info");
})

/// create sign in api and send the details back to the frontend 

app.get("/user-details", (req, res)=>{
    res.send(arr);
})

app.listen(port, () => {
    console.log("welcome to backend");
})

