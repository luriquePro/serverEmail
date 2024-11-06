import { Message } from "amqplib";
import "dotenv/config";
import express, { Application } from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import { QUEUE_STATUS } from "./constants/QUEUE.ts";
import { IRMQPConsumQueue, IRMQPDeclareExchange } from "./interfaces/RMQPInterface.ts";
import { QueuesModel } from "./models/Queues.ts";
import { MailerProvider } from "./providers/MailerProvider.ts";
import { RMQPProvider } from "./providers/RMQPProvider.ts";

class App {
	public express: Application;
	public isProduction: boolean;
	private __dirname: string;
	private RMQPProvider: typeof RMQPProvider;
	private queues: IRMQPConsumQueue[] = [];

	public constructor() {
		this.express = express();
		this.isProduction = process.env.NODE_ENV === "production";
		this.__dirname = path.dirname(fileURLToPath(import.meta.url));
		this.RMQPProvider = RMQPProvider;

		this.express.use("/assets", express.static(this.__dirname + "src/assets"));
		this.database()
			.then(async () => {
				const rawQueues = await QueuesModel.find({ status: QUEUE_STATUS.ACTIVE }).lean();
				this.queues = rawQueues.map(queue => ({ queue: queue.queue, exchange: queue.exchange, routingKey: queue.routingKey }));
			})
			.then(() => this.declareExchange(this.queues))
			.then(() => this.consumeQueue(this.queues));
	}

	private async database() {
		const URL = process.env.MONGODB_URI!;
		mongoose
			.connect(URL, { dbName: process.env.MONGODB_DATABASE })
			.then(() => console.log(`MongoDB connected!`))
			.catch(() => console.log("Error to connect mongoDB"));
	}

	private async consumeQueue(consumeData: IRMQPConsumQueue[]) {
		const server = new this.RMQPProvider();
		await server.start();

		for (const { queue } of consumeData) {
			await server.consume(queue, async (message: Message) => {
				const content = JSON.parse(message.content.toString());
				await MailerProvider.sendMail({ to: content.to, code: content.code, code_template: content.code_template });
			});
		}
	}

	private async declareExchange(declareData: IRMQPDeclareExchange[]) {
		const server = new this.RMQPProvider();
		await server.start();

		for (const { queue, exchange, routingKey } of declareData) {
			await server.declareExchange(exchange);
			await server.declareQueue(queue);
			await server.bindQueue(queue, exchange, routingKey);
		}
	}
}

export { App };
