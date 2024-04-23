"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const userService_1 = require("../services/userService");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: false,
    },
    authProvider: {
        type: String,
        required: true,
    },
    providerId: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
userSchema.post("findOneAndUpdate", function (doc, next) {
    (0, userService_1.removeUserCache)(doc.providerId);
    next();
});
userSchema.post("findOneAndDelete", function (doc, next) {
    (0, userService_1.removeUserCache)(doc.providerId);
    next();
});
userSchema.index({ providerId: 1, authProvider: 1 });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map