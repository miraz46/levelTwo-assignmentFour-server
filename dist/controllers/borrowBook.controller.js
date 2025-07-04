"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowBookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrowBook_model_1 = __importDefault(require("../models/borrowBook.model"));
const zod_1 = require("zod");
const book_model_1 = __importDefault(require("../models/book.model"));
exports.borrowBookRoutes = express_1.default.Router();
const createBorrowBookZodSchema = zod_1.z.object({
    book: zod_1.z.string(),
    quantity: zod_1.z.number().int().min(1, { message: "Quantity must be at least 1" }),
    dueDate: zod_1.z.coerce.date()
});
// Create New Borrow Book
exports.borrowBookRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield createBorrowBookZodSchema.parseAsync(req.body);
        yield book_model_1.default.borrowBook(body.book, body.quantity, body.dueDate);
        const bookCreated = yield borrowBook_model_1.default.create(body);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: bookCreated
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            error
        });
    }
}));
// Get books using aggregation pipeline
exports.borrowBookRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookCollection = yield borrowBook_model_1.default.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo"
                }
            },
            {
                $unwind: "$bookInfo"
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn"
                    },
                    totalQuantity: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: bookCollection
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Failed to get borrowed books",
            error
        });
    }
}));
