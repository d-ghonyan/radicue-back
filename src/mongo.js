import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
	u_name: {
		type: String,
		required: "Name is required",
	},
	u_surname: {
		type: String,
		required: "Surname is required",
	},
	username:
	{
		type: String,
		required: "Username is required",
	},
	password:
	{
		type: String,
		required: "Password is required",
	},
	reports: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Report' } ],
});

///TODO patient id?
const ReportSchema = new mongoose.Schema(
{
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	prompt:
	{
		type: String,
		required: "Prompt is required",
	},
	generated:
	{
		type: String,
		required: "Generated response is required",
	},
	p_name: {
		type: String,
		required: "Patient name is required",
	},
	p_surname: {
		type: String,
		required: "Patient surname is required",
	},
});

const User = mongoose.model("User", UserSchema, "Users");
const Report = mongoose.model("Report", ReportSchema, "Reports");

export {User, Report};