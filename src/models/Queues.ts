import { Document, Schema, model } from "mongoose";
import { CheckAndGenerateUniqueId } from "../common/CheckAndGenerateUniqueId.ts";
import { QUEUE_STATUS } from "../constants/QUEUE.ts";
import { IQueueDTO } from "../interfaces/RMQPInterface.ts";

export interface IQueuesMongo extends Partial<Omit<Document, "id">>, IQueueDTO {}

const QueuesSchema = new Schema<IQueuesMongo>(
	{
		id: { type: String, required: true, trim: true, index: true, unique: true },
		queue: { type: String, required: true, trim: true, index: true, unique: true },
		exchange: { type: String, required: true, trim: true, index: true, unique: true },
		routingKey: { type: String, required: true, trim: true, index: true, unique: true },
		status: { type: String, required: true, trim: true, index: true, default: QUEUE_STATUS.ACTIVE },
	},
	{ timestamps: true },
);

QueuesSchema.pre("validate", async function (next) {
	this.id = await CheckAndGenerateUniqueId(QueuesModel);
	next();
});

export const QueuesModel = model<IQueuesMongo>("queues", QueuesSchema);
