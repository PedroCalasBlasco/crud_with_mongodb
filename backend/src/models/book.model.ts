import mongoose, { Document, Schema }  from "mongoose"

export interface IBook extends Document {
    title: string;
    author: string;
    genre: string;
    publication_date: string;
}

const mongooseSchema = new Schema<IBook>(
    {
      title: { type: String, required: true },
      author: { type: String, required: true },
      genre: { type: String, required: true },
      publication_date: { type: String, required: true },
    },
    { timestamps: true }
)

export const Book = mongoose.model<IBook>("Book", mongooseSchema)