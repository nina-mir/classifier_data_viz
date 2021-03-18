const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
 
const app = express();
 
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
 
app.get('/', (req, res) => {
    res.json({
        message: 'Behold The EVN Stack! :-)'
    });
});
 
app.get('/messages', (req, res) => {
    res.json({
        message: 'not much to show for now!'
    });
   
});
 
app.post('/messages', (req, res) => {
    console.log(req.body);
    messages.create(req.body).then((message) => {
        res.json(message);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
