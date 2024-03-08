const express = require("express");
const { SaveProject } = require("../controllers/projects.controller");

const router = express.Router();

router.post("/add", SaveProject);

module.exports = router;
