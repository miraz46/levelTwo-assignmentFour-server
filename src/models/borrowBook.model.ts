import { model, Schema } from "mongoose";
import { IBorrowBook } from "../interfaces/borrowBook.interface";

const borrowBookSchema = new Schema<IBorrowBook>({
    book: {
        type: Schema.Types.ObjectId,
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
},
    {
        timestamps: true,
        versionKey: false,
    })

const BorrowBook = model<IBorrowBook>("BorrowBook", borrowBookSchema);
export default BorrowBook;