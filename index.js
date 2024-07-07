import app from "./app.js";
import dotenv from "dotenv";
import connectToDatabase from "./utils/connectToDatabase.js"

dotenv.config();

// connectToDatabase().then(() => {
// 	app.listen(process.env.PORT || 30000,"192.168.26.96", () => {
// 		console.log(`Server is listening on PORT ${process.env.PORT || 30000}`);
// 	});
// });
connectToDatabase().then(() => {
	app.listen(process.env.PORT || 30000, () => {
		console.log(`Server is listening on PORT ${process.env.PORT || 30000}`);
	});
});
