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
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./controllers/books.controller");
const zod_1 = require("zod");
const book_model_1 = __importDefault(require("./models/book.model"));
const borrowBook_model_1 = __importDefault(require("./models/borrowBook.model"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/books", books_controller_1.bookRoutes);
const createBookZodSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.string(),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number(),
    available: zod_1.z.boolean().optional()
});
const createBorrowBookZodSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().min(1, { message: "Quantity must be at least 1" }),
    dueDate: zod_1.z.coerce.date()
});
const borrowBookParamsSchema = zod_1.z.object({
    bookId: zod_1.z.string().length(24, 'Invalid book id')
});
// Create New Books
app.post('/create-book', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// Update Single Book
app.put('/edit-book/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const updatedBook = req.body;
    const book = yield book_model_1.default.findByIdAndUpdate(bookId, updatedBook, { new: true, upsert: true });
    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book
    });
}));
// Borrow A Book
app.post('/borrow/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = yield borrowBookParamsSchema.parseAsync(req.params);
        const { quantity, dueDate } = yield createBorrowBookZodSchema.parseAsync(req.body);
        yield book_model_1.default.borrowBook(bookId, quantity, dueDate);
        const borrowRecord = yield borrowBook_model_1.default.create({
            book: bookId,
            quantity,
            dueDate
        });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowRecord
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
app.get('/borrow-summary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                    title: "$bookInfo.title",
                    isbn: "$bookInfo.isbn",
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
app.get('/', (req, res, next) => {
    try {
        res.send('Welcome to Library Management Fullstack');
    }
    catch (error) {
        next(error);
    }
});
// Unknown Route Error Handler
app.use((req, res) => {
    res.status(404).json({ message: "ROUTE NOT FOUND" });
});
// Global Error Handler
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
