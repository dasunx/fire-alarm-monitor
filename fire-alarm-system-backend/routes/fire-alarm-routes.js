const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const fireAlarmController = require("../controllers/fire-alarm-controller");



/* create sensor route - 'POST' Method */
/* validating requst info using chck() method of the express-validator package */
router.post(
  "/",
  check("status").not().isEmpty().isBoolean(),
  check("floorNo").not().isEmpty().isInt(),
  check("roomNo").not().isEmpty().isInt(),
  check("co2").isInt({ min: 0, max: 10 }),
  check("smoke").isInt({ min: 0, max: 10 }),

  fireAlarmController.createSensor
);

router.get("/", fireAlarmController.getAllSensors);//get all sensor route - 'GET' Method
router.patch("/:sid", fireAlarmController.updateSensor);//update sensor route - 'PATCH' Method

module.exports = router;
