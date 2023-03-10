const express = require("express");
const { Show } = require("../models/index");
const router = express.Router();
const { check, validationResult } = require("express-validator");

router.get("/", async (req, res) => {
	const shows = await Show.findAll();
	res.json(shows);
});

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const oneShow = await Show.findByPk(id);

		if (!oneShow) {
			res.status(404).send("show not found");
		} else {
			res.json(oneShow);
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/genre/:genre", async (req, res) => {
	const { genre } = req.params;
	try {
		const shows = await Show.findAll({
			where: { genre },
		});
		if (!shows) {
			res.status(404).send("no shows with that genre");
		} else {
			res.json(shows);
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

router.put(
	"/:id/watched",
	[check("rating").notEmpty().withMessage("Rating is required")],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const id = req.params.id;
		const { rating } = req.body;
		try {
			const foundShow = await Show.findByPk(id);
			if (foundShow) {
				await foundShow.update({ rating });
				res.send("rating updated successfully!");
			} else {
				res.status(404).send("show not found");
			}
		} catch (error) {
			res.status(500).send(error);
		}
	}
);

router.put(
	"/:id/updates",
	[
		check("status")
			.notEmpty()
			.withMessage("Status is required")
			.isLength({ min: 5, max: 25 })
			.withMessage("Status must be between 5 and 25 characters"),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { status } = req.body;
		try {
			const show = await Show.findByPk(req.params.id);
			if (!show) {
				res.status(404).send("no show found");
			} else {
				await show.update({ status });
				res.json(show);
			}
		} catch (error) {
			res.status(500).send(error);
		}
	}
);

router.delete("/:id", async (req, res) => {
	const id = req.params.id;
	try {
		await Show.destroy({
			where: { id },
		});
		const foundShow = await Show.findByPk(id);
		if (!foundShow) res.send("show deleted");
	} catch (error) {
		res.status(500).send(error);
	}
});
module.exports = router;
