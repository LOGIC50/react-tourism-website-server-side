// back-end
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
        const database = client.db('tourism');
        const serviceCollection = database.collection('services');
        const reviewCollection = database.collection('review');
        const guideCollection = database.collection('guides');
        const registerCollection = database.collection('register')

        // POST API
        app.post('/services', async(req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        // POST REGISTRATION API
        app.post('/register/', async(req, res) => {
            const register = req.body;
            console.log('hit the post api', register);
            const result = await registerCollection.insertOne(register); 
            res.json(result);
        })

        // GET REGISTRATION API
        app.get('/register/', async(req, res) => {
            const cursor = registerCollection.find({});
            const register = await cursor.toArray();
            res.json(register);
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