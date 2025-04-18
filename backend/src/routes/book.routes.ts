import express, {NextFunction, Request, Response} from "express"
import { Book, IBook } from "../models/book.model"
import { request } from "http";

export const bookRouter = express.Router()

//MIDDLEWARE
const getBook = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
  
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      response.status(404).json({ message: "Id Invalid" })
      return
    }
  
    try {
      const book = await Book.findById(id)
      if (!book) {
        response.status(404).json({ message: "Book can't be found" })
        return
      }
  
      (response as Response & { book?: IBook }).book = book
      next()
  
    } catch (error) {
      if (error instanceof Error) {
        response.status(500).json({ message: error.message })
      } else {
        response.status(500).json({ message: 'Unknown error occurred' })
      }
    }
}


//Get Books
bookRouter.get('/', async(__request: Request, response: Response) => {
    try {
        const books = await Book.find()
        if(books.length === 0){
            response.status(204).json([])
        }else {
            response.json(books)
        }
    } catch(error) {
        if (error instanceof Error) {
            response.status(500).json({ message: error.message })
        } else {
            response.status(500).json({ message: 'Unknown error occurred' })
        }
    }
})

//Get By ID
bookRouter.get('/:id', getBook, async( __request: Request, response: Response ) => {
    response.json((response as Response & { book?: IBook }).book)
})


bookRouter.delete('/:id', getBook, async( __request: Request, response: Response ) => {

    try {
        const book = (response as Response & { book?: IBook }).book

        
        if (!book) {
            response.status(404).json({ message: "Book not found" });

        } else {
            await book.deleteOne({ _id: book._id})
            response.json((response as Response & { book?: IBook }).book)
        }
    }  catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
        } else {
          response.status(500).json({ message: 'Unknown error occurred' });
        }
    }
})



bookRouter.post('/', async(request: Request, response: Response) => {
    const { title, author, genre, publication_date } = request.body
    if(!title || !author || !genre || !publication_date) {
        response.status(400).json({
            message: "Fields title, author, genre and publication_date are required"
        })
    } else {
        const book = new Book(
            {
                title,
                author,
                genre,
                publication_date
            }
        )
        try {
            const newBook = await book.save()
            response.status(201).json(newBook)

        } catch(error) {
            if (error instanceof Error) {
                response.status(400).json({ message: error.message })
            }
        }
    }
})



bookRouter.put('/:id', getBook, async( request: Request, response: Response ) => {
    try {
        const book = (response as Response & { book?: IBook }).book

        if (!book) {
            response.status(404).json({ message: "Book not found" });

        } else {

            book.title = request.body.title || book.title
            book.author = request.body.author || book.author
            book.genre = request.body.genre || book.genre
            book.publication_date = request.body.publication_date || book.publication_date
    
            const updatedBook = await book.save()
            response.json(updatedBook)
        }

    } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
        } else {
          response.status(500).json({ message: 'Unknown error occurred' });
        }
    }
})



bookRouter.patch('/:id', getBook, async( request: Request, response: Response ) => {

    if(!request.body.title && request.body.author && request.body.genre && request.body.publication_date ) {
        response.status(400).json({message: "At least one field must be finded"})
    }

    try {
        const book = (response as Response & { book?: IBook }).book

        if (!book) {
            response.status(404).json({ message: "Book not found" });

        } else { 

            book.title = request.body.title || book.title
            book.author = request.body.author || book.author
            book.genre = request.body.genre || book.genre
            book.publication_date = request.body.publication_date || book.publication_date
    
            const updatedBook = await book.save()
            response.json(updatedBook)
        }

    } catch (error) {
        if (error instanceof Error) {
          response.status(400).json({ message: error.message });
        } else {
          response.status(500).json({ message: 'Unknown error occurred' });
        }
    }
})


