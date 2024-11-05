import { QUEUE_STATUS } from "../constants/QUEUE.ts";

export interface IQueueDTO {
	id: string;
	queue: string;
	exchange: string;
	routingKey: string;
	status: QUEUE_STATUS;
}

export interface IRMQPConsumQueue {
	queue: string;
	exchange: string;
	routingKey: string;
}

export interface IRMQPDeclareExchange {
	queue: string;
	exchange: string;
	routingKey: string;
}
