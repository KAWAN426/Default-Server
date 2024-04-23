"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
dotenv_1.default.config();
if (process.env.NODE_ENV === "production") {
    require("module-alias/register");
}
const cors_1 = tslib_1.__importDefault(require("cors"));
const LoginRoutes_1 = tslib_1.__importDefault(require("./routers/LoginRoutes"));
const connect_1 = tslib_1.__importDefault(require("./lib/mongodb/connect"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((err, req, res, _next) => {
    console.error(`ERROR - ${req.originalUrl}: ${err.message}`);
    res.status(500).send({
        data: null,
        message: err.message,
        status: "error",
    });
});
app.use("/api/login", LoginRoutes_1.default);
(0, connect_1.default)();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
//# sourceMappingURL=index.js.map