const express = require("express");
const { check } = require("express-validator");//to validate the requsts
const router = express.Router();
const adminController = require("../controllers/admin-controller");

/* signup route - 'POST' method */
/* validating requst info using chck() method of the express-validator package  */
router.post(
  "/signup",
  check("name").not().isEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 3 }),
  adminController.signUp
);
router.post("/login", adminController.login);//login route- 'POST'

module.exports = router;
