import { Document, Schema, model } from "mongoose";
import { CheckAndGenerateUniqueId } from "../common/CheckAndGenerateUniqueId.ts";
import { MAIL_PROVIDER_STATUS } from "../constants/MAIL_PROVIDER.ts";
import { IMailProvidersDTO } from "../interfaces/MailProvidersInterface.ts";

export interface IMailProvidersMongo extends Partial<Omit<Document, "id">>, IMailProvidersDTO {}

const MailProvidersSchema = new Schema<IMailProvidersMongo>(
	{
		id: { type: String, required: true, trim: true, index: true, unique: true },
		host: { type: String, required: true, trim: true, index: true },
		port: { type: Number, required: true, index: true },
		secure: { type: Boolean, required: true, index: true },
		user: { type: String, required: true, trim: true, index: true, unique: true },
		pass: { type: String, required: true, trim: true, index: true, unique: true },
		status: { type: String, required: true, trim: true, index: true, default: MAIL_PROVIDER_STATUS.ACTIVE },
	},
	{ timestamps: true },
);

MailProvidersSchema.pre("validate", async function (next) {
	this.id = await CheckAndGenerateUniqueId(MailProvidersModel);
	next();
});

export const MailProvidersModel = model<IMailProvidersMongo>("mail_providers", MailProvidersSchema);
