"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeToken = exports.tokenRegistration = exports.upsertUser = exports.findExistUser = exports.removeUserCache = exports.findUserByProviderId = void 0;
const tslib_1 = require("tslib");
const User_1 = tslib_1.__importDefault(require("../models/User"));
const userCache = {};
/*
 * 사용자가 무조건 있을때: findUserByProviderId();
 * 사용자가 없을 수도 있을때: findUserByProviderId<null>({notExistError: false});
 */
async function findUserByProviderId({ providerId, authProvider, userId, }) {
    const cachedData = userCache[providerId];
    if (cachedData && Date.now() < cachedData.expireAt)
        return cachedData.user;
    const user = await User_1.default.findOne({ providerId, authProvider }).lean().exec();
    const IsUserNotExist = !user || (userId && userId !== providerId);
    if (IsUserNotExist) {
        throw new Error("The user ID provided is invalid. Please verify your information and try again.");
    }
    cacheUser(providerId, user);
    return user;
}
exports.findUserByProviderId = findUserByProviderId;
function removeUserCache(providerId) {
    if (providerId in userCache)
        delete userCache[providerId];
}
exports.removeUserCache = removeUserCache;
async function findExistUser({ providerId, authProvider, }) {
    if (!providerId || !authProvider)
        return;
    const cachedData = userCache[providerId];
    if (cachedData && Date.now() < cachedData.expireAt)
        return cachedData.user;
    const user = await User_1.default.findOne({ providerId, authProvider }).lean().exec();
    if (user) {
        cacheUser(providerId, user);
    }
    return user;
}
exports.findExistUser = findExistUser;
function cacheUser(providerId, user) {
    const expireAt = Date.now() + 1000 * 60 * 30; // 30분
    userCache[providerId] = { user, expireAt };
}
async function upsertUser(userData) {
    const result = await User_1.default.findOneAndUpdate({ providerId: userData.providerId }, userData, {
        upsert: true,
        new: true,
        runValidators: true,
    })
        .lean()
        .exec();
    if (!result)
        throw new Error("Failed to create a new user");
}
exports.upsertUser = upsertUser;
async function tokenRegistration(userId, twitchToken) {
    await User_1.default.findByIdAndUpdate(userId, { twitchToken }).lean().exec();
}
exports.tokenRegistration = tokenRegistration;
async function removeToken(userId) {
    await User_1.default.findByIdAndUpdate(userId, {
        twitchToken: null,
    })
        .lean()
        .exec();
}
exports.removeToken = removeToken;
//# sourceMappingURL=userService.js.map