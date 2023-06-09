const express = require("express");
const router = express.Router();
const statesController = require("../../controllers/statesController");

router.route("/").get(statesController.getAllStates);
router.route("/:code").get(statesController.getState);
router.route("/:code/funfact")
  .get(statesController.getFunFact)
  .post(statesController.postFunFacts)
  .patch(statesController.patchFunFacts)
  .delete(statesController.deleteFunFact);

router.route("/:code/capital").get(statesController.getCapital);
router.route("/:code/nickname").get(statesController.getNickname);
router.route("/:code/population").get(statesController.getPopulation);
router.route("/:code/admission").get(statesController.getAdmission);


//router.route("/:code/funfact").post(statesController.postFunFacts);

//router.route("/:code/funfact").patch(statesController.patchFunFacts);
//router.route("/:code/funfact").delete(statesController.deleteFunFact);

//router.route("/:id")
//.get(statesController.getStateFacts);

module.exports = router;
