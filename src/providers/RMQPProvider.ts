import { Channel, connect, Connection, Message } from "amqplib";

class RMQPProvider {
	private conn!: Connection;
	private chanel!: Channel;

	public async start() {
		this.conn = await connect(process.env.AMQP_URL!);
		this.chanel = await this.conn.createChannel();
	}

	public async consume(queue: string, handler: (message: Message) => void) {
		return this.chanel.consume(queue, message => {
			handler(message as Message);
			this.chanel.ack(message as Message);
		});
	}

	public async declareExchange(exchange: string) {
		return this.chanel.assertExchange(exchange, "direct", { durable: true });
	}

	public async declareQueue(queue: string) {
		return this.chanel.assertQueue(queue, { durable: true });
	}

	public async bindQueue(queue: string, exchange: string, routingKey: string) {
		return this.chanel.bindQueue(queue, exchange, routingKey);
	}
}

export { RMQPProvider };
