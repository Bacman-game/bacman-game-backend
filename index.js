const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Score = require('./models/Score');
const connectToDB = require('./utils/database');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router()
router.use('/api/v1/scores', (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.send({ data: null, error: 'Invalid token' });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.send({ data: null, error: 'Invalid token' });
        req.body.user = decoded.id;
    });
    next();
})

const app = express();
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3001'
// }));
app.use(express.json());
app.use('/', router);

const PORT = 3000;

app.post('/api/v1/signup', async function (req, res) {
    console.log('POST /api/v1/signup');
    const { username, address } = req.body;
    if (!username || !address || username.length <= 5) return res.send({ data: null, error: 'Invalid username or address' });
    await connectToDB();
    const userByUsername = await User.findOne({ username });
    if (userByUsername) {
        if (userByUsername.address !== address) return res.send({ data: null, error: 'Username already exists' });
        return res.send({ 
            token: jwt.sign({ id: userByUsername._id }, JWT_SECRET),
            error: null 
        });
    }
    const userByAddress = await User.findOne({ address });
    if (userByAddress) return res.send({ data: null, error: 'Wallet already exists' });
    const newUser = await User.create({ username, address });
    res.send({ 
        token: jwt.sign({ id: newUser._id }, JWT_SECRET),
        error: null 
    });
});

app.post('/api/v1/scores', async function (req, res) {
    console.log('POST /api/v1/scores');
    const { points, user } = req.body;
    if (!points || !user ) return res.send({ data: null, error: 'Invalid request' });
    await connectToDB();
    const userById = await User.findById(user);
    if (!userById) return res.send({ data: null, error: 'Invalid user' });
    await Score.create({ 
        score: points, 
        username: userById.username, 
        address: userById.address 
    });
    res.send({ });
});

app.get('/api/v1/scores', async function (req, res) {
    console.log('GET /api/v1/scores');
    await connectToDB();
    const topTenscores = await Score.find().sort({ score: -1 }).limit(10);
    await Score.deleteMany({ _id: { $nin: topTenscores.map(score => score._id) } });
    res.send({ scores: topTenscores });
});

app.listen(PORT, function () {
    console.log(`Bacman Backend app listening on port ${PORT}`);
});