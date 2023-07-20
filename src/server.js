import express from 'express';
import mongoose from "mongoose";

import { app } from "./router.js";

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_CONNECT, {useNewUrlParser: true,});

const db = mongoose.connection;

db.on('error', (err) => {
	console.log('mongoose error: ' + err);
	process.exit(1);
})

db.once('open', () => {
	
	app.listen(process.env.PORT)
	{
		console.log(`listening on port ${process.env.PORT}`);
	}

})