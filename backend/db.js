// const mongoose = require("mongoose");
// const chalk = require('chalk');

import mongoose from "mongoose";
import chalk from "chalk";
const mongoURL = "mongodb://localhost:27017/inotebook2";

export const connectToMongo = async () => {
    try {
       await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(chalk.yellow("Connected to MongoDB Suceessfully !!"));
    } catch (error) {
        console.error(chalk.red("Could not connect to MongoDB", error));
    }
}
