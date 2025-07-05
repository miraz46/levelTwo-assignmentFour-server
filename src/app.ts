import express, { Application, NextFunction, Request, Response } from "express";
import { bookRoutes } from "./controllers/books.controller";
import { z } from "zod";
import Book from "./models/book.model";
import BorrowBook from "./models/borrowBook.model";
import cors from 'cors';

const app: Application = express();


app.use(express.json());
app.use(cors());
app.use("/books", bookRoutes);




const createBookZodSchema = z.object(
    {
        title: z.string(),
        author: z.string(),
        genre: z.string(),
        isbn: z.string(),
        description: z.string().optional(),
        copies: z.number(),
        available: z.boolean().optional()
    }
)
const createBorrowBookZodSchema = z.object(
    {
        quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
        dueDate: z.coerce.date()
    }
)
const borrowBookParamsSchema = z.object({
    bookId: z.string().length(24, 'Invalid book id')
});

type BorrowBookBody = z.infer<typeof createBorrowBookZodSchema>;
type BorrowBookParams = z.infer<typeof borrowBookParamsSchema>;

// Create New Books
app.post('/create-book', async (req: Request, res: Response) => {
    try {
        const body = await createBookZodSchema.parseAsync(req.body)
        const bookCreated = await Book.create(body);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: bookCreated
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
            error
        })
    }
})

// Update Single Book
app.put('/edit-book/:id', async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const updatedBook = req.body;
    const book = await Book.findByIdAndUpdate(bookId, updatedBook, { new: true, upsert: true });

    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book
    })
})


// Borrow A Book
app.post('/borrow/:bookId', async (req: Request<BorrowBookParams, {}, BorrowBookBody>, res: Response) => {
    try {
        const { bookId } = await borrowBookParamsSchema.parseAsync(req.params);
        const { quantity, dueDate } = await createBorrowBookZodSchema.parseAsync(req.body);
        await Book.borrowBook(bookId, quantity, dueDate);
        const borrowRecord = await BorrowBook.create({
            book: bookId,
            quantity,
            dueDate
        });

        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowRecord
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
            error
        })
    }
})

// Get books using aggregation pipeline
app.get('/borrow-summary', async (req, res) => {
    try {
        const bookCollection = await BorrowBook.aggregate([
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
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Failed to get borrowed books",
            error
        });
    }
});


app.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send('Welcome to Library Management Fullstack')
    } catch (error) {
        next(error)
    }
})

// Unknown Route Error Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "ROUTE NOT FOUND" })
})

// Global Error Handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Validation failed",
            error: error.errors || error
        });
    }
})

export default app;