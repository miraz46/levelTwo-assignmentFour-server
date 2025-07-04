"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    copies: {
        type: Number,
        required: true,
        min: [0, "Copies cannot be negative"],
        validate: {
            validator: Number.isInteger,
            message: "Copies must be an integer",
        },
    },
    available: {
        type: Boolean,
        default: true,
    },
});
const Book = (0, mongoose_1.model)("Book", bookSchema);
exports.default = Book;
