import { model, Schema } from "mongoose";
import { IBook, IBookModel } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook>({
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
        trim: true
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

}, {
    timestamps: true,
    versionKey: false
})


//Pre Hook
bookSchema.pre("save", function (next) {
    this.available = this.copies > 0;
    next();
});

//Static Method
bookSchema.statics.borrowBook = async function (bookId: string, quantity: number) {
    const book = await this.findById(bookId);
    if (!book) throw new Error("Book not found");

    if (book.copies < quantity) {
        throw new Error("Not enough copies available");
    }
    book.copies -= quantity;
    await book.save();
    return book;
};


const Book = model<IBook, IBookModel>("Book", bookSchema);
export default Book;