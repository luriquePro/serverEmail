import { Document, Schema, model } from "mongoose";
import { v4 } from "uuid";
import { MAILER_STATUS } from "../constants/MAILER.ts";
import { IMailerDTO } from "../interfaces/MailerInterface.ts";

export interface IMailerMongo extends Partial<Omit<Document, "id">>, IMailerDTO {}

const MailerSchema = new Schema<IMailerMongo>(
	{
		id: { type: String, default: v4(), required: true, trim: true, index: true, unique: true },
		from: { type: String, required: true, trim: true, index: true },
		to: { type: String, required: true, trim: true, index: true },
		code_template: { type: String, required: true, trim: true, index: true },
		subject: { type: String, required: true, trim: true, index: true },
		html: { type: String, required: true, trim: true, index: true },
		text: { type: String, required: true, trim: true, index: true },
		code: { type: String, trim: true, index: true },
		status: { type: String, required: true, trim: true, index: true, default: MAILER_STATUS.ACTIVE },
	},
	{ timestamps: true },
);

export const MailerModel = model<IMailerMongo>("emails", MailerSchema);
