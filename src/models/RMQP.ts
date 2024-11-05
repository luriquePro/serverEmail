import { Document, Schema, model } from "mongoose";
import { v4 } from "uuid";
import { QUEUE_STATUS } from "../constants/QUEUE.ts";
import { IQueueDTO } from "../interfaces/RMQPInterface.ts";

export interface IQueuesMongo extends Partial<Omit<Document, "id">>, IQueueDTO {}

const RMQPSchema = new Schema<IQueuesMongo>(
	{
		id: { type: String, default: v4(), required: true, trim: true, index: true, unique: true },
		queue: { type: String, required: true, trim: true, index: true, unique: true },
		exchange: { type: String, required: true, trim: true, index: true, unique: true },
		routingKey: { type: String, required: true, trim: true, index: true, unique: true },
		status: { type: String, required: true, trim: true, index: true, default: QUEUE_STATUS.ACTIVE },
	},
	{ timestamps: true },
);

export const QueuesModel = model<IQueuesMongo>("queues", RMQPSchema);
