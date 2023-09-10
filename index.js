const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Card = require('./Card');
const { MongoClient, ServerApiVersion } = require('mongodb');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURI = process.env.MONGODB_URI;

const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("roko");
    const cardsCollection = database.collection("cards");
    if (cardsCollection) {
      console.log("Connected to the collection");
    }

    app.get('/api/cards', async (req, res) => {

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

     const skip = (page - 1) * limit;
      const total = await cardsCollection.countDocuments();
      const pages = Math.ceil(total / limit);

      try {
        const cursor = cardsCollection.find({}).skip(skip).limit(limit); 
        const cards = await cursor.toArray();
        return res.json({
          total,
          pages,
          cards
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Veriler alınamadı.' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });

  } catch (err) {
    console.log(err);
  }

}

run().catch(console.dir);
