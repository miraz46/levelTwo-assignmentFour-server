"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./controllers/books.controller");
const borrowBook_controller_1 = require("./controllers/borrowBook.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/books", books_controller_1.bookRoutes);
app.use("/api/borrow", borrowBook_controller_1.borrowBookRoutes);
app.get('/', (req, res, next) => {
    try {
        res.send('Welcome to Library Management');
    }
    catch (error) {
        next(error);
    }
});
app.use((req, res) => {
    res.status(404).json({ message: "ROUTE NOT FOUND" });
});
app.use((error, req, res, next) => {
    if (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Validation failed",
            error: error.errors || error
        });
    }
});
exports.default = app;
