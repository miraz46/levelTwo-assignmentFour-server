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
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = __importDefault(require("../models/book.model"));
const zod_1 = require("zod");
exports.bookRoutes = express_1.default.Router();
const createBookZodSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.string(),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number(),
    available: zod_1.z.boolean()
});
// Create New Books
exports.bookRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield createBookZodSchema.parseAsync(req.body);
        const bookCreated = yield book_model_1.default.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
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
// Get All Books
exports.bookRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const filter = query.filter;
    const sortBy = query.sortBy || "createdAt";
    const sort = query.sort === "desc" ? -1 : 1;
    const limit = parseInt(query.limit) || 10;
    const queryField = {};
    if (filter) {
        queryField.genre = filter;
    }
    // const books = await Book.find();
    const books = yield book_model_1.default.find(queryField)
        .sort({ [sortBy]: sort })
        .limit(limit);
    res.status(200).json({
        success: true,
        message: "Books fetched successfully",
        data: books
    });
}));
// Get Single Book
exports.bookRoutes.get('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const book = yield book_model_1.default.findById(bookId);
    res.status(200).json({
        success: true,
        message: "Book fetched successfully",
        data: book
    });
}));
// Update Single Book
exports.bookRoutes.patch('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const updatedBook = req.body;
    const book = yield book_model_1.default.findByIdAndUpdate(bookId, updatedBook, { new: true });
    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book
    });
}));
// Delete Single Book
exports.bookRoutes.delete('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const book = yield book_model_1.default.findByIdAndDelete(bookId);
    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null
    });
}));
