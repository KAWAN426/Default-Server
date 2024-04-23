"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOneBody = exports.validateOrBody = exports.validateAndBody = void 0;
function validateAndBody(requiredKeys) {
    return function (req, res, next) {
        const missingKeys = requiredKeys.filter((key) => !(key in req.body));
        if (missingKeys.length > 0) {
            const missingKeysString = missingKeys.join(", ");
            next(new Error(`Missing required fields: ${missingKeysString}`));
            return;
        }
        next();
    };
}
exports.validateAndBody = validateAndBody;
function validateOrBody(requiredKeys) {
    return function (req, res, next) {
        const isAnyKeyPresent = requiredKeys.some((key) => key in req.body);
        if (!isAnyKeyPresent) {
            next(new Error(`At least one of the required fields must be present: ${requiredKeys.join(", ")}`));
            return;
        }
        next();
    };
}
exports.validateOrBody = validateOrBody;
function validateOneBody(requiredKeys) {
    return function (req, res, next) {
        const isAnyKeyPresent = requiredKeys in req.body;
        if (!isAnyKeyPresent) {
            next(new Error(`At least one of the required fields must be present: ${requiredKeys}`));
            return;
        }
        next();
    };
}
exports.validateOneBody = validateOneBody;
//# sourceMappingURL=index.js.map