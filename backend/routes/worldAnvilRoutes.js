const express = require("express");
const { getWorldAnvilData } = require("../controllers/worldAnvilController");

const router = express.Router();

router.post("/query", getWorldAnvilData);

module.exports = router;
