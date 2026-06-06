const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
require("dotenv").config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Running Successfully");
});

//connect mongodb

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// make a jwt token verification

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
);


const verifyToken = async (req, res, next) => {
  // console.log(req.headers,'this is from verity token function')
  const { authorization } = req?.headers;
  if (!authorization) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

async function run() {
  try {
    //await client.connect();
    // Write the database and collection name
    const db = client.db("Sport_Project");
    const facilityCollection = db.collection("facility");
    const bookingCollection = db.collection("booking");
    // make route just for 6 card
    app.get("/facility", async (req, res) => {
      const result = await facilityCollection.find().limit(6).toArray();
      res.send(result);
    });

    // make post for add facility
    app.post("/my-facility", async (req, res) => {
      const fcbody = req.body;
      const result = await facilityCollection.insertOne(fcbody);
      res.send(result);
    });

    // get the my all facility and emplement search
    //  app.get('/my-facility',async(req,res)=>{
    //   const search = req.query.search
    //  console.log(search,'this is search server.js ')
    //   let cursor ;
    //   //this is for single search
    //   // if(search){
    //   // cursor = await facilityCollection.find({facilityName:{
    //   //   $regex:search,
    //   //   $options:'i',
    //   // }})
    //   // console.log(cursor,'this is search cursor')
    //   // }
    //   if(search){
    //   cursor = await facilityCollection.find({
    //     $or: [
    //       {
    //         facilityName: {
    //           $regex:search,
    //            $options:'i',
    //         }
    //      },
    //      {
    //         facilityType: {
    //           $regex:search,
    //            $options:'i',
    //         }
    //      },
    //     ]
    //   })
    //   // console.log(cursor,'this is search cursor')
    //   }
    //   else{
    //     cursor = facilityCollection.find()
    //   }
    //   const result = await cursor.toArray()
    //   res.send(result)
    //  })

    app.get("/my-facility", async (req, res) => {
      const search = req.query.search?.trim();

      let cursor;
      if (search) {
        cursor = facilityCollection.find({
          $or: [
            { facilityName: { $regex: search, $options: "i" } },
            { facilityType: { $regex: search, $options: "i" } },
          ],
        });
      } else {
        cursor = facilityCollection.find();
      }

      const result = await cursor.toArray();
      res.send(result);
    });

    // get the data of login user of there own email and get own manage-facility
    app.get("/my-facility/email/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const result = await facilityCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });
    // get the id of my facility
    app.get("/my-facility/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await facilityCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    //delete the facility
    app.delete("/my-facility/:id", async (req, res) => {
      const id = req.params.id;
      const result = await facilityCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    //edit my facility data
    app.patch("/my-facility/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const fbody = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDocument = {
        $set: {
          ...fbody,
        },
      };
      const result = await facilityCollection.updateOne(filter, updateDocument);
      res.send(result);
    });

    //this is booking facility post
    app.post("/my-booking", async (req, res) => {
      const Bbody = req.body;
      const result = await bookingCollection.insertOne(Bbody);
      res.send(result);
    });
    //this is get booking facility data
    app.get("/my-booking", async (req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result);
    });
    //this is get booking data for particuler user
    app.get("/my-booking/:userid", verifyToken, async (req, res) => {
      const userid = req.params.userid;
      // console.log(userid,'this is from backend user id ')
      const result = await bookingCollection.find({ userId: userid }).toArray();
      res.send(result);
    });

    // delete the booking facility
    app.delete("/my-booking/:id", async (req, res) => {
      const id = req.params.id;
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

   // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is runnin on port ${port}`);
});
