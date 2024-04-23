"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginController_1 = require("../controllers/loginController");
const verifyToken_1 = require("../middleware/verifyToken");
const express_1 = require("express");
const router = (0, express_1.Router)();
/*
 * 구글 로그인용 사용자 생성
 * verifyToken 참조
 */
router.post("/google", (0, verifyToken_1.verifyToken)(), loginController_1.loginUserGoogle);
exports.default = router;
//# sourceMappingURL=LoginRoutes.js.map