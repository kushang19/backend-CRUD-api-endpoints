// const connectToMongo = require('./db');
// const express = require('express');
import {connectToMongo} from './db.js';
import express from 'express';
import chalk from 'chalk';
import authRoutes from './routes/auth.js'; // Import your auth routes
import noteRoutes from './routes/notes.js' // Import your note routes

connectToMongo();

const app = express();
const port = 5000;

const requestBodyMiddleware = express.json();

app.use(requestBodyMiddleware)

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.listen(port, () => {
    console.log(chalk.blueBright(`Example app listening on port ${port}`));
})
