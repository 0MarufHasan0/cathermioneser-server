import express from "express"
import 'dotenv/config'
import cors from 'cors'
import { MongoClient } from 'mongodb';



const app = express();
const port = 8000

// Adds headers: Access-Control-Allow-Origin: *
 app.use(express.json())
app.use(cors())

// http://localhost:8000/


const client = new MongoClient(process.env.MONGODB_BASE_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

 const mongodbConnect = await connectToMongoDB()

 const db = mongodbConnect.db('Kindora')
 const kindoraCollection = db.collection('Kindora-collection')


 app.post('/add-kindora' , async(req , res)=> {
    const data = req.body
    console.log('data : ', data)
    const result = await kindoraCollection.insertOne(data)
    console.log(result)
    res.send(result)


 })

 app.get('/add-kindora' , async(req, res)=>{
     const result = await kindoraCollection.find().toArray();
    res.send(result);
 })




app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});