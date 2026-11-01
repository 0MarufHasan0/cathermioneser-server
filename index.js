import express from "express"
import 'dotenv/config'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';



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

//  category filter korar jonno route

 app.get("/events", async (req, res) => {

  try {

    // URL theke category collect korbo
    
    const { category } = req.query;

    //  console.log("Category:", category);

    // Category onujayi filter
    const query = category ? { eventType: category } : {};

    // console.log("Query:", query);

    // Database theke data anbo
    const result = await kindoraCollection.find(query).toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});


//  Signle route

app.get('/kindora/:id', async (req, res) => {{

  const {id} = req.params;
  const query = {_id: new ObjectId(id)};
  const result = await kindoraCollection.findOne(query);
  res.send(result);

}})





// delete korar jonno route

app.delete('/kindora/:id', async (req, res) => {
  const {id} = req.params;
  const {email} = req.body;

    const query = {
    _id: new ObjectId(id),
    creatorEmail: email,
  };
  const result = await kindoraCollection.deleteOne(query);

  console.log('Deleted result:', result);
  res.send(result);

})


// Event create korar track

app.get('/my-kindora/:email', async (req, res) => {
  const {email}= req.params
  console.log('email : ', email)
  const result = await kindoraCollection.find({creatorEmail: email}).toArray();
  res.send(result)

})


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});