const express = require("express");
const router = express.Router();
const statesController = require("../../controllers/statesController");

router.route("/").get(statesController.getAllStates);

//router.route("/:id")
//.get(statesController.getStateFacts);

module.exports = router;
