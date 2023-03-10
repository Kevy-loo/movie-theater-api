const express = require("express");
const { Show, User } = require("../models/index");
const router = express.Router();

router.get("/", async (req, res) => {
	const users = await User.findAll();
	res.json(users);
});

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.findByPk(id);

		if (!user) {
			res.status(404).send("user not found");
		} else {
			res.json(user);
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/:id/shows", async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.findByPk(id, {
			include: { model: Show },
		});
		if (!user) {
			res.status(404).send("no user with that id found");
		} else {
			res.json(user.shows);
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

router.put("/:userId/shows/:showId", async (req, res) => {
	const { userId, showId } = req.params;
	try {
		const user = await User.findByPk(userId);
		const show = await Show.findByPk(showId);

		if (!user) {
			return res.status(404).send("user with id not found");
		} else if (!show) {
			return res.status(404).send("show with id  not found");
		} else {
			await user.addShow(show);
			const updatedUser = await User.findByPk(userId, { include: Show });
			res.json(updatedUser);
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
