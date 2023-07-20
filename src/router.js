import fetch from 'node-fetch';
import { sendEmail } from './mail.js';
import {User, Report} from './mongo.js';
import hbs from 'hbs';
import cors from 'cors';
import path from 'path';
import * as url from 'url';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const config = new Configuration({
    apiKey: process.env.apiKey,
});

const app = express();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const publicPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

app.use(express.static(publicPath));

app.set('view engine', 'hbs');

app.set('views', viewsPath);

hbs.registerPartials(partialsPath);

app.use(cors());

app.use(express.json());

const openai = new OpenAIApi(config);

app.post("/chat", async (req, res)=>{
	const {prompt} = req.body;

	const completion = await openai.createCompletion({
		model: "text-davinci-003",
		max_tokens: 512,
		temperature: 0,
		prompt: prompt,
	});
	res.send(completion.data.choices[0].text);
});

app.get('/test', async (req, res) => {
	const user = new User({username: 'admin', password: "admin"});

	await user.save();

	const report = new Report({user: user._id, prompt: "hello?", generated: 'who do you think i am'});

	await report.save();

	const found = await Report.findOne({prompt: 'hello?'}).populate('user').exec();

	console.log(found, found.username);
});

export { app };
//const report = await Report.create({ user_id: "64b6fa8069fc8d0f8b8842f0", prompt: "hello!", generated: "do you think i'm an ai",});

//console.log(report);

//const found = await Report.findOne({_id: "64b6fa8069fc8d0f8b8842f0"}).populate('user_id').exec();
////const user = User.findOne({_id: "64b6fa8069fc8d0f8b8842f0"});
//console.log(found);