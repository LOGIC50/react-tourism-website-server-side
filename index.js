const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lsk7p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run(){
    try{
        await client.connect();
        // console.log('database is connected');
        const database = client.db('tourism');
        const serviceCollection = database.collection('services');
        const reviewCollection = database.collection('review');
        const guideCollection = database.collection('guides');

        // POST API
        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        // GET SERVICE API 
        app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET REVIEW API
        app.get('/review', async(req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        })

        // GET GUIDE API
        app.get('/guides', async(req, res) => {
            const cursor = guideCollection.find({});
            const guides = await cursor.toArray();
            res.send(guides);
        })
        
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tourism Server is running');
});

app.listen(port, () => {
    console.log('Server is running', port);
});