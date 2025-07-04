import express, { Request, Response } from "express";
import Book from "../models/book.model";

export const bookRoutes = express.Router();

// Get All Books
bookRoutes.get('/', async (req: Request, res: Response) => {
    const query = req.query;
    const filter = query.filter as string;
    const sortBy = query.sortBy as string || "createdAt";
    const sort = query.sort === "desc" ? -1 : 1;
    const limit = parseInt(query.limit as string) || 10;
    const queryField: any = {};
    if (filter) {
        queryField.genre = filter;
    }
    // const books = await Book.find();
    const books = await Book.find(queryField)
        .sort({ [sortBy]: sort })
        .limit(limit);
    res.status(200).json({
        success: true,
        message: "Books fetched successfully",
        data: books
    })
})
// Get Single Book
bookRoutes.get('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);

    res.status(200).json({
        success: true,
        message: "Book fetched successfully",
        data: book
    })
})
// Delete Single Book
bookRoutes.delete('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId;
    const book = await Book.findByIdAndDelete(bookId);

    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null
    })
})
