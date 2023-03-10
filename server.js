const express = require("express");
const { db } = require("./db");
const app = express();
const seed = require("./seed");
const port = 3000;

const showRouter = require("./routes/showRouter");
const userRouter = require("./routes/userRouter");

app.use(express.json());
seed();

app.use("/users", userRouter);
app.use("/shows", showRouter);

app.listen(port, () => {
	db.sync();
	console.log(`App listening on port ${port}`);
});
