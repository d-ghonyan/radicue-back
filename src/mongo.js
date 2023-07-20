import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
	username:
	{
		type: String,
		required: "Name is required",
	},
	password:
	{
		type: String,
		required: "Password is required",
	},
	reports: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Report' } ],
});

const ReportSchema = new mongoose.Schema(
{
	user:  [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
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
});

const User = mongoose.model("User", UserSchema, "Users");
const Report = mongoose.model("Report", ReportSchema, "Reports");

export {User, Report};