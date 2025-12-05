// const connectToMongo = require('./db');
// connectToMongo();
// const express = require('express');
// const app = express();
// const PORT = 5000;
// var cors = require('cors');
// app.use(cors());
// app.use(express.json());


// // Define a basic route
// app.use('/api/auth',require('./routes/auth'))
// app.use('/api/notes',require('./routes/notes'))

// // Start the server
// app.listen(PORT, () => {
//     console.log(`iNootbook backend is running at http://localhost:${PORT}`);
// });




require('dotenv').config(); // Load environment variables
const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo(); // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// Port from .env or fallback to 5000
const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Test Route
app.get('/', (req, res) => {
    res.send("iNotebook Backend Running Successfully");
});

// Start Server
app.listen(PORT, () => {
    console.log(`iNotebook backend listening at http://localhost:${PORT}`);
});

