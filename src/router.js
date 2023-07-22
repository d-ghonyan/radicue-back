import fetch from 'node-fetch';
import { sendEmail } from './mail.js';
import hbs from 'hbs';
import cors from 'cors';
import path from 'path';
import * as url from 'url';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { User, Report } from './mongo.js';
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const config = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.use(express.static(publicPath));

app.set('view engine', 'hbs');

app.set('views', viewsPath);

hbs.registerPartials(partialsPath);

app.use(cors());

app.use(express.json());

const openai = new OpenAIApi(config);

app.post("/chat", async (req, res) => {
	const { prompt } = req.body;

	// const completion = await openai.createCompletion({
	// 	model: "text-davinci-003",
	// 	max_tokens: 512,
	// 	temperature: 0,
	// 	prompt: prompt,
	// });

	// console.log(completion, completion.data);

	res.send(completion.data.choices[0].text);
});


app.get("/testchat", async (req, res) => {
	const { prompt } = { prompt: "How is the weather today" };

	const rep = {
		p_name: 'Patient2',
		p_surname: 'Klor',
		prompt: prompt,
		generated: "idk",
		user: mongoose.Types.ObjectId('64b702d4060456011e7f4740'),
	}

	const report = new Report(rep);
	await report.save();

	const found = await Report.findOne({ generated: "idk" }).populate('user');

	console.log(found, found.user);

	// const completion = await openai.createCompletion({
	// 	model: "text-davinci-003",
	// 	max_tokens: 512,
	// 	temperature: 0,
	// 	prompt: prompt,
	// });

	// console.log(completion, completion.data);

	// res.send(completion.data.choices[0].text);
});

app.post('/report', async (req, res) => {

	const { prompt, user, p_name, p_surname } = req.query;

	if (!prompt || !user || !p_name || !p_surname)
	{
		res.status(400).send({ status: 'failed', msg: 'Missing required data' });
		return ;
	}

	try {

		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			max_tokens: 512,
			temperature: 0,
			prompt: prompt,
		});

		const generated = completion.data.choices[0].text;

		await new Report({ user, prompt, p_name, p_surname, generated }).save();

		res.send({ status: 'ok', report: generated });

	} catch (error) {
		console.log(error);
		res.status(500).send({ status: 'failed', msg: 'Server error, check logs' });
	}
});

app.post('/login', async (req, res) => {

	const { username, password } = req.body;

	if (!username || !password) {
		res.status(400).send({ status: 'failed', msg: 'Missing required data' });
		return;
	}

	try {

		const user = await User.findOne({ username });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			res.status(401).send({ status: 'failed', msg: 'Username or password incorrect' });
			return;
		}

		res.send({ status: 'ok', msg: 'authenticated', id: user._id }); /// TODO tokens?

	} catch (error) {

		console.log(error);
		res.status(500).send({ status: 'failed', msg: 'Exception caught, check logs' });

	}
});

app.post('/register', async (req, res) => {

	const { username, password, name, surname } = req.body;

	if (!username || !password || !name || !surname) {
		res.status(400).send({ status: 'failed', msg: 'missing required data' });
		return;
	}

	try {

		const hashed = await bcrypt.hash(password, 10);

		const findUser = await User.findOne({ username });

		if (findUser) {
			res.status(403).send({ status: 'failed', msg: 'User already exists' });
			return;
		}

		const user = new User({ username, password: hashed, u_name: username, u_surname: surname });

		await user.save();

		res.send({ status: 'ok', msg: 'User succesfully created', user: user._id }); /// TODO tokens, it is

	} catch (error) {

		console.log('MongoDB error: ' + error);
		res.send({ status: 'failed', msg: 'Database error' });

	}
});

export { app };

//const report = await Report.create({ user_id: "64b6fa8069fc8d0f8b8842f0", prompt: "hello!", generated: "do you think i'm an ai",});

//console.log(report);

//const found = await Report.findOne({_id: "64b6fa8069fc8d0f8b8842f0"}).populate('user_id').exec();
////const user = User.findOne({_id: "64b6fa8069fc8d0f8b8842f0"});
//console.log(found);