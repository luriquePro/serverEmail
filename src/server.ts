import moment from "moment";
import { App } from "./app.ts";

class Server {
	private application: App;
	public port: number;
	public isTestAmbient: boolean;

	constructor() {
		this.application = new App();
		this.port = Number(process.env.PORT);
		this.isTestAmbient = process.env.NODE_ENV === "test";
	}

	public run() {
		if (!this.isTestAmbient) {
			this.application.express.listen(this.port, () => {
				console.log(`Server is running in url: http://localhost:${this.port}. Started of ${moment().utc().toDate()}`);
			});
		}
	}
}

const SERVER = new Server();
SERVER.run();
