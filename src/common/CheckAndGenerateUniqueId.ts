import { Model } from "mongoose";
import { v4 } from "uuid";

export const CheckAndGenerateUniqueId = async (model: Model<any>): Promise<string> => {
	let id: string;

	do {
		id = v4();
	} while (await model.findOne({ id }));

	return id;
};
