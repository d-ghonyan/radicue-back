const form = document.querySelector('form'),
	title_event = document.querySelector('#title_event'),
	title_accepted_event = document.querySelector('#title_accepted_event'),
	title_question = document.querySelector('#title_question'),
	events = document.querySelector('#events'),
	accepted_events = document.querySelector('#accepted_events'),
	not_accetped_btn = document.querySelector('#not_accetped_btn'),
	question_btn = document.querySelector('#question_btn'),
	accepted_btn = document.querySelector('#accepted_btn'),
	questions = document.querySelector('#questions');

accepted_btn.onclick = function () {
	accepted_events.style.display = "flex";
	events.style.display = "none";
	questions.style.display = "none";
}

not_accetped_btn.onclick = function () {
	accepted_events.style.display = "none";
	events.style.display = "flex";
	questions.style.display = "none";
}

question_btn.onclick = function () {
	accepted_events.style.display = "none";
	events.style.display = "none";
	questions.style.display = "flex";
}

const createDivEvent = (data, i) => {
	let div = document.createElement('div');
	let title1 = document.createElement('span');
	let description = document.createElement('span');
	let date = document.createElement('span');
	let student_info = document.createElement('span');
	div.classList.add("event_container", "container" + i);
	title1.textContent = `title: ${data.title}`;
	description.textContent = `description: ${data.description}`;
	date.textContent = `date: ${data.date}`;
	student_info.textContent = `student_info: ${data.username} ${data.email}`;
	div.append(title1, description, date, student_info);

	if (!data.accepted)
	{
		let update = document.createElement('button');
		update.innerText = "Accept event";
		update.onclick = function () {
			fetch("/event", {
				method: "PATCH",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					"email": data.email,
					"username": data.username,
					"title": data.title,
					"_id": data._id,
					"description": data.description,
					"date": data.date
				}),
			}).then((response) => {
				response.json().then((data) => {
					if (data.error)
						title_event.innerText = "Error accepting the event";
					else
						this.disabled = true;
				})
			})
		}
		div.append(update);
	}
	return (div);
}

const createDivQuestion = (data) => {
	let div = document.createElement('div');
	let question = document.createElement('p');
	let student_info = document.createElement('p');
	let answer = document.createElement('button');

	div.classList.add("question_container");
	student_info.textContent = `student_info: ${data.email}`;
	question.textContent = `question: ${data.question}`;
	answer.textContent = `Answer the question`;
	div.append(question, student_info, answer);
	return (div);
}

fetch('/events').then((response) => {
	response.json().then((data) => {
		if (data.error) {
			title.textContent = data.error;
		} else {
			values = Object.values(data);
			if (values.length == 0)
			{
				title_event.innerText = "No events";
				title_accepted_event.innerText = "No events";
			}
			for (let i = 0; i < values.length; i++)
			{
				(values[i].accepted ? accepted_events : events).append(createDivEvent(values[i], i));
			}
		}
	})
});

fetch('/questions').then((response) => {
	response.json().then((data) => {
		if (data.error) {
			title.textContent = data.error;
		} else {
			values = Object.values(data);
			if (values.length == 0)
				title_question.innerText = "No questions asked";
			for (let i = 0; i < values.length; i++)
			{
				questions.append(createDivQuestion(values[i]));
			}
		}
	})
});