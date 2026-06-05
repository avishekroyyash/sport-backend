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
const bookingCollection = db.collection('booking')
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
   // get the data of login user of there own email and get own manage-facility
   app.get('/my-facility/email/:email',async(req,res)=>{
    const email = req.params.email
    const result = await facilityCollection.find({userEmail:email}).toArray();
    res.send(result)
   })
    // get the id of my facility
   app.get('/my-facility/:id',async(req,res)=>{
    const id = req.params.id
    const result = await facilityCollection.findOne({_id:new ObjectId(id)});
    res.send(result)
   })
   
   //delete the facility
   app.delete('/my-facility/:id',async(req,res)=>{
    const id= req.params.id
    const result = await facilityCollection.deleteOne({_id:new ObjectId(id)})
    res.send(result)
   })
   //edit my facility data 
   app.patch('/my-facility/:id',async(req,res)=>{
   const id = req.params.id
   const fbody = req.body
   const filter = {_id:new ObjectId(id)}
   const updateDocument = {
    $set:{
      ...fbody
    }
   }
   const result = await facilityCollection.updateOne(filter,updateDocument)
   res.send(result)
   })

   
  //this is booking facility post 
  app.post('/my-booking',async(req,res)=>{
    const Bbody = req.body
    const result = await bookingCollection.insertOne(Bbody)
    res.send(result)
  }) 
  //this is get booking facility data 
  app.get('/my-booking',async(req,res)=>{
    const result = await bookingCollection.find().toArray()
    res.send(result)
  })
  //this is get booking data for particuler user 
  app.get('/my-booking/:userid',async(req,res)=>{
  const userid=req.params.userid
  console.log(userid,'this is from backend user id ')
  const result=await bookingCollection.find({userId:userid}).toArray()
  res.send(result)
  })

  // delete the booking facility
  app.delete('/my-booking/:id',async(req,res)=>{
   const id = req.params.id
   const result = await bookingCollection.deleteOne({_id:new ObjectId(id)})
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