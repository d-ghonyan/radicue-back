import dotenv from 'dotenv'
import SibApiV3Sdk from "sib-api-v3-sdk";
import fetch from 'node-fetch';

dotenv.config();

const sendEmail = async (data) => {
	let {key, email, username, subject, body} = data;

	let response = await fetch("https://api.sendinblue.com/v3/smtp/email", {
		method: "POST",
		headers: {'accept': 'application/json', 'api-key': `${key}`, 'content-type': 'application/json'},
		body: JSON.stringify({
			"sender": {
				"name": "David Ghonyan",
				"email": "david.ghonyan02@gmail.com"
			},
			"to": [
				{
					"email": email,
					"name": username
				}
			],
			"subject": subject,
			"htmlContent": `<html><head></head><body><p>Dear ${username}, ${body}.<br><br>Sincerely, Student union team.</p></body></html>`
		})
	});
	console.log(response.status, response.statusText);
};

export { sendEmail };
