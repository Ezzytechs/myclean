//const mongoURI = process.env.DB_CONNECTION_STRING;
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://ezzytechs:EZZYkid04@users.7mr1r.mongodb.net/?retryWrites=true&w=majority&appName=users";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);