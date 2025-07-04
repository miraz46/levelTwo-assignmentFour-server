"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const bookRoute = (0, express_1.Router)();
bookRoute.post('/book', user_controller_1.addBook);
exports.default = bookRoute;
