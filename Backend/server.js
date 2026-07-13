const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());

//middleware
app.use(express.json());

console.log(process.env.PORT);
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log('Server is running');
})