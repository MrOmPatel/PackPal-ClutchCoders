const express = require("express");
const router = express.Router();
const itemCtrl = require("../controllers/itemController");

router.get("/", itemCtrl.getItems);
router.post("/", itemCtrl.createItem);
router.put("/:id", itemCtrl.updateItem);

module.exports = router;