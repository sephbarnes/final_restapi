const express = require("express");
const router = express.Router();
const statesController = require("../../controllers/statesController");

router.route("/").get(statesController.getAllStates);
router.route("/:code").get(statesController.getState);


router.route("/:code/funfact").post(statesController.postFunFacts);

router.route("/:code/funfact").patch(statesController.patchFunFacts);

//router.route("/:id")
//.get(statesController.getStateFacts);

module.exports = router;
