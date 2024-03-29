const router = require("express").Router();
const { User, validate } = require("../models/userSchema");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error){
			console.log(error)
			return res.status(400).send({ message: error.details[0].message });
		}

		//Checking if email already exist
		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		// Password Hashing
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		//Updating Hashed Password and Saving in Database
		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
		console.log(error)
	}
});

module.exports = router;