"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const borrowBookSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer',
        },
    },
    dueDate: {
        type: Date,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false,
});
const BorrowBook = (0, mongoose_1.model)("BorrowBook", borrowBookSchema);
exports.default = BorrowBook;
