const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
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

// Write the database and collection name

async function run() {
  try {
    await client.connect();
  

    
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