"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserGoogle = void 0;
const tslib_1 = require("tslib");
const service = tslib_1.__importStar(require("../services/userService"));
const loginUserGoogle = async (req, res, next) => {
    try {
        const user = req.body.user;
        await service.upsertUser(user);
        res.status(200).send({
            data: null,
            message: "새로운 사용자를 생성했습니다",
            status: "success",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.loginUserGoogle = loginUserGoogle;
//# sourceMappingURL=loginController.js.map