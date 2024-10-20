"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const watch_controller_1 = require("../controllers/watch.controller");
const router = (0, express_1.Router)();
router.get('/video-id', watch_controller_1.getVideoById);
router.get('/', watch_controller_1.getAllVideos);
exports.default = router;
