export type Queues = "biblioteca_de_cursos" | "email_teste";
export type Exchanges = "direct_biblioteca_de_cursos" | "direct_email_teste";
export type RoutingKeys = "key_biblioteca_de_cursos" | "key_email_teste";
export interface IRMQPConsumQueue {
	queue: Queues;
	exchange: Exchanges;
	routingKey: RoutingKeys;
}

export interface IRMQPDeclareExchange {
	queue: string;
	exchange: string;
	routingKey: string;
}
