const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT 

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is Running Successfully')
})

//connect mongodb

const uri =process.env.MONGO_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    await client.connect();
    // Write the database and collection name
const db = client.db('Sport_Project')
const facilityCollection = db.collection('facility')
    // make route just for 6 card 
app.get('/facility',async(req,res)=>{
    const result = await facilityCollection.find().limit(6).toArray()
    res.send(result)
})
   // make post for add facility
  app.post('/my-facility',async(req,res)=>{
    const fcbody = req.body ;
    const result = await facilityCollection.insertOne(fcbody)
    res.send(result)
  })   
   // get the my facility
   app.get('/my-facility',async(req,res)=>{
    const id = req.params.id
    const result = await facilityCollection.find().toArray()
    res.send(result)
   })
    // get the id of my facility
   app.get('/my-facility/:id',async(req,res)=>{
    const id = req.params.id
    const result = await facilityCollection.findOne({_id:new ObjectId(id)});
    res.send(result)
   })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);






app.listen(port, () => {
  console.log(`Server is runnin on port ${port}`)
})