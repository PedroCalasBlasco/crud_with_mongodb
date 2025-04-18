import { Response } from 'express'
import { Book } from '../../models/book.model'

declare global {
    namespace Express {
        interface Response {
            book?: Book  
        }
    }
}

export {}
