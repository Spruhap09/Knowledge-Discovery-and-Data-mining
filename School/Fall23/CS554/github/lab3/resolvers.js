import {GraphQLError, parseValue} from 'graphql';

import {
  authors as authorCollection,
  books as bookCollection
} from './config/mongoCollections.js';

import redis from 'redis';
const client = redis.createClient();
client.connect().then(() => {});

import validation from './validation.js'

import {v4 as uuid} from 'uuid';

export const resolvers = {
    Query: {
        authors: async () => {
            let exists = await client.exists('authors');
            if (exists){
                const allAuthors = await client.get('authors');
                console.log("Sending the author details from the cache");
                return JSON.parse(allAuthors);
            }
            const authors = await authorCollection();
            const allAuthors = await authors.find({}).toArray();
            
            if (!allAuthors){
                throw new GraphQLError(`Internal Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            console.log("Adding author details to the cache")
            await client.set('authors', JSON.stringify(allAuthors));
            await client.expire('authors', 3600);
            return allAuthors;
        },
        books: async () => {
            let exists = await client.exists('books');
            if (exists){
                const allBooks = await client.get('books');
                console.log("Sending book details from the cache");
                return JSON.parse(allBooks);
            }
            const books = await bookCollection();
            const allBooks = await books.find({}).toArray();
            if (!allBooks){
                throw new GraphQLError(`Internal Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            console.log("Adding book details to the cache")
            await client.set('books', JSON.stringify(allBooks));
            await client.expire('books', 3600);
            return allBooks;
        }, 
        getAuthorById: async (_, args) => {
            validation.checkUUID(args._id, 'Author ID')

            let exists = await client.exists(`Author${args._id}`);
            if (exists){
                const author = await client.get(`Author${args._id}`);
                console.log("Sending the author details from the cache");
                return JSON.parse(author);
            }

            const authors = await authorCollection();
            const author = await authors.findOne({_id: args._id}); 
            if (!author){
                throw new GraphQLError('Author Not Found', {
                    extensions: {code: 'NOT_FOUND'}
                  });
            }
            console.log("Adding the author to the cache")
            await client.set(`Author${args._id}`, JSON.stringify(author));
            return author;
        },
        getBookById: async (_, args) => {
            validation.checkUUID(args._id, 'Book Id')

            let exists = await client.exists(`Book${args._id}`);
            if (exists){
                const book = await client.get(`Book${args._id}`);
                console.log("Sending the book details from the cache");
                return JSON.parse(book);
            }
            
            const books = await bookCollection();
            const book = await books.findOne({_id: args._id}); 
            if (!book){
                throw new GraphQLError('Book Not Found', {
                    extensions: {code: 'NOT_FOUND'}
                  });
            }
            console.log("Adding the book to the cache")
            await client.set(`Book${args._id}`, JSON.stringify(book));
            return book;
        },
        booksByGenre: async (_, args) => {
            
            validation.checkString(args.genre, 'Genre')
            let exists = await client.exists(args.genre.toLowerCase());
            if(exists){
                const genres = await client.get(args.genre.toLowerCase());
                console.log("Sending the genre details from the cache");
                return JSON.parse(genres);
            }
            const books = await bookCollection();
            //This should printout only those books that match a particular genre
            const allBooks = await books.find({genres: {$in: [new RegExp(args.genre, "i")]}}).toArray();
            if (!allBooks){
                throw new GraphQLError(`Internal Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }

            console.log("Adding the genre details to the cache")
            await client.set(args.genre.toLowerCase(), JSON.stringify(allBooks));
            await client.expire(args.genre.toLowerCase(), 3600);
            return allBooks;
        }, 
        booksByPriceRange: async(_, args) => {
            
            if (args.min <= 0){
                throw new GraphQLError(
                    `The provided min is not a positive float or a whole number`,
                    {
                      extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }
            if (args.max <= 0 || args.max <= args.min){
                throw new GraphQLError(
                    `The provided max is not float or a whole number or is less than the provided min value`,
                    {
                      extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }

            let exists = await client.exists(`min${args.min}max${args.max}`);
            if(exists){
                const books = await client.get(`min${args.min}max${args.max}`);
                console.log("Sending the books details in this price range from the cache");
                return JSON.parse(books);
            }

            const books = await bookCollection();
            const booksInRange = await books.find({price: {$gte: args.min, $lte: args.max}}).toArray();

            console.log("Adding the book details in this price range to the cache")
            await client.set(`min${args.min}max${args.max}`, JSON.stringify(booksInRange));
            await client.expire(`min${args.min}max${args.max}`, 3600);
            return booksInRange;
        }, 

        searchAuthorsByName: async (_, args) => {

            validation.checkString(args.searchTerm, 'Search Term');

            let exists = await client.exists(args.searchTerm.toLowerCase());
            if(exists){
                const books = await client.get(args.searchTerm.toLowerCase());
                console.log("Sending the books written by an author details from the cache");
                return JSON.parse(books);
            }
            const authors = await authorCollection();
            const authorsWithField = await authors.find({$or: [
                {first_name : {$regex: args.searchTerm, $options: 'i'}}, 
                {last_name: {$regex: args.searchTerm, $options: 'i'}}
            ]}).toArray();

            if (!authorsWithField){
                throw new GraphQLError(`Internal Server Error`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            
            console.log("Adding the books written by an author details to the cache")
            await client.set(args.searchTerm.toLowerCase(), JSON.stringify(authorsWithField));
            await client.expire(args.searchTerm.toLowerCase(), 3600);

            return authorsWithField;
        }
    }, 
    Book: {
        author: async (parentValue) => {

            const authors = await authorCollection();
            const author = await authors.findOne({_id: parentValue.authorId});
            if (!author){
                throw new GraphQLError('Author Not Found', {
                    extensions: {code: 'NOT_FOUND'}
                  });
            }
            return author;
        }
    }, 
    Author: {
        books: async (parentValue, args) => {

            const books = await bookCollection();
            const booksByAuthor = await books.find({authorId: parentValue._id}).toArray();
            if (args.limit) {
                if (args.limit % 1 != 0 || args.limit <= 0){
                    throw new GraphQLError('Limit should be a whole number and positive', {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

            }
            if (!args.limit || args.limit > booksByAuthor.length){
                return booksByAuthor;
            }
            else if (args.limit < booksByAuthor.length){
                booksByAuthor = booksByAuthor.slice(0, args.limit);
                return booksByAuthor; 
            }
        }, 
        numOfBooks: async (parentValue) => {

            const books = await bookCollection();
            const numOfBooks = await books.count({authorId: parentValue._id}); 
            return numOfBooks;

        }
    }, 
    Mutation: {
        addAuthor: async (_, args) => {

            let firstName = args.first_name; 
            let lastName = args.last_name;
            let dateBirth = args.date_of_birth;
            let city = args.hometownCity;
            let state = args.hometownState; 
            

            firstName = validation.checkName(firstName, 'First Name');
            lastName = validation.checkName(lastName, 'Last Name');
            dateBirth = validation.checkDate(dateBirth);
            city = validation.checkString(city, 'hometownCity');
            state = validation.checkState(state);
                
            const newAuthor = {
                _id: uuid(),
                first_name: firstName,
                last_name: lastName,
                date_of_birth: dateBirth,
                hometownCity: city,                    
                hometownState: state, 
                books: []
            }
            const authors = await authorCollection();
            let insertAuthor = await authors.insertOne(newAuthor);
            if(!insertAuthor.acknowledged || !insertAuthor.insertedId){
                throw new GraphQLError(`Could not Add Employer`, {                        
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }
            await client.set(`Author${newAuthor._id}`, JSON.stringify(newAuthor));
            return newAuthor;
        }, 
        editAuthor: async (_, args) => {

            if (!args.first_name && !args.last_name && !args.date_of_birth && !args.hometownCity && !args.hometownState){
                throw new GraphQLError(`You need provide at least one edit field`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }

            if(args.books || args.numOfBooks){
                throw new GraphQLError(`You cannot edit the books array`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }

            validation.checkUUID(args._id, 'Author Id');

            const authors = await authorCollection();
            let editAuthor = await authors.findOne({_id: args._id});
            if(editAuthor){
                if((args.first_name && editAuthor.first_name !== args.first_name)|| args.first_name === ""){
                    args.first_name = validation.checkName(args.first_name, 'First Name');
                    editAuthor.first_name = args.first_name;
                }
                else if(args.first_name && editAuthor.first_name === args.first_name){
                    throw new GraphQLError(`The first name cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }
                if((args.last_name && editAuthor.last_name !== args.last_name) || args.last_name === ""){
                    args.last_name = validation.checkName(args.last_name, 'Last Name');
                    editAuthor.last_name = args.last_name;
                }
                else if(args.last_name && editAuthor.last_name === args.last_name){
                    throw new GraphQLError(`The last name cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }
                if((args.date_of_birth && editAuthor.date_of_birth !== args.date_of_birth) || args.date_of_birth === ""){
                    args.date_of_birth = validation.checkDate(args.date_of_birth);
                    editAuthor.date_of_birth = args.date_of_birth;
                }
                else if(args.date_of_birth && editAuthor.date_of_birth === args.date_of_birth){
                    throw new GraphQLError(`The date of birth cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }
                if((args.hometownCity  && editAuthor.hometownCity !== args.hometownCity) || args.hometownCity === ""){
                    args.hometownCity = validation.checkString(args.hometownCity, "hometownCity");
                    editAuthor.hometownCity = args.hometownCity;
                }
                else if(args.hometownCity && editAuthor.hometownCity === args.hometownCity){
                    throw new GraphQLError(`The hometownCity cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }
                if((args.hometownState && editAuthor.hometownState !== args.hometownState) || args.hometownState === ""){
                    args.hometownState = validation.checkState(args.hometownState, "hometownState");
                    editAuthor.hometownState = args.hometownState;
                }
                else if(args.hometownState && editAuthor.hometownState === args.hometownState){
                    throw new GraphQLError(`The hometownState cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }
                await authors.updateOne({_id: args._id}, {$set: editAuthor});

            }
            else{
                throw new GraphQLError(
                    `Could not update author with _id of ${args._id}`,
                    {
                      extensions: {code: 'NOT_FOUND'}
                    }
                );
            }
            await client.set(`Author${editAuthor._id}`, JSON.stringify(editAuthor));
            return editAuthor;
        }, 
        removeAuthor: async (_, args) => {

            validation.checkUUID(args._id, 'Author Id');
            const authors = await authorCollection();
            const books = await bookCollection();

            const booksToBeDeleted = await books.find({authorId: args._id}).toArray();
            for (let book of booksToBeDeleted){
                
                let exists = await client.exists(`Book${book._id}`);
                if (exists){
                    console.log(`deleting book with the id ${book._id} from the cache`)
                    await client.del(`Book${book._id}`);
                }
            }
            const deleted = await books.deleteMany({authorId: args._id}); 
            if (!deleted.acknowledged){
                throw new GraphQLError(
                    `Could not delete books with authorId of ${args._id}`,
                    {
                      extensions: {code: 'NOT_FOUND'}
                    }
                );
            }
           
            const deletedAuthor = await authors.findOneAndDelete({_id: args._id});
            if (!deletedAuthor) {
                throw new GraphQLError(
                  `Could not delete author with _id of ${args._id}`,
                  {
                    extensions: {code: 'NOT_FOUND'}
                  }
                );
            }
            let exists = await client.exists(`Author${deletedAuthor._id}`);
            if(exists){
                console.log(`deleting author with the id ${args._id} from the cache`)
                await client.del(`Author${deletedAuthor._id}`);
            }
            return deletedAuthor;

        }, 
        addBook: async (_, args) => {

            let title = args.title; 
            let genres = args.genres;
            let publicationDate = args.publicationDate;
            let publisher = args.publisher;
            let summary = args.summary;
            let isbn = args.isbn;
            let language = args.language;
            let pageCount = args.pageCount;
            let price = args.price;
            let format = args.format;
            let authorId = args.authorId;

            title = validation.checkString(title, 'Title');

            if(genres.length === 0){
                throw new GraphQLError(`Error: You need to provide at least one genre`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            for (let genre of genres){
                genre = validation.checkString(genre, 'Genre');
            }
            publicationDate = validation.checkDate(publicationDate);
            publisher = validation.checkString(publisher, 'Publisher');
            summary = validation.checkString(summary, 'Summary');
            isbn = validation.checkIsbn(isbn);
            language = validation.checkString(language, 'Language');
            
            if (pageCount <= 0){
                throw new GraphQLError(`Error: you need to provide a postive whole number for pageCount`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            if (price <= 0){
                throw new GraphQLError(`Error: you need to provide a postive whole number or float for price`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            if(format.length === 0){
                throw new GraphQLError(`Error: you need to provide at least format element`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            for (let form of format){
                form = validation.checkString(form, 'Format');
            }

            const authors = await authorCollection();
            let author = await authors.findOne({_id: authorId});
            
            if (!author){
                throw new GraphQLError(
                    `Could not Find Author with an ID of ${authorId}`,
                    {
                      extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }

            const newBook = {
                _id: uuid(), 
                title: title, 
                genres: genres, 
                publicationDate: publicationDate,
                publisher: publisher,
                summary: summary,
                isbn: isbn,
                language: language,
                pageCount: pageCount,
                price: price, 
                format: format,
                authorId: authorId

            }
            
            const books = await bookCollection();
            let book = await books.insertOne(newBook); 
            if (!book.acknowledged || !book.insertedId) {
                throw new GraphQLError(`Could not Add Book`, {
                  extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }

            const newAuthor = await authors.findOne({_id: authorId});
            await client.set(`Author${newAuthor._id}`, JSON.stringify(newAuthor));
            await client.set(`Book${newBook._id}`, JSON.stringify(newBook));
            return newBook;
        }, 
        editBook: async(_, args) => {

            args._id = validation.checkUUID(args._id, 'Book Id'); 

            if(args.length < 2){
                    throw new GraphQLError(`You need to provide atleast one field to edit for book`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
            }
            
            const books = await bookCollection();
            const authors = await authorCollection();

            let editBook = await books.findOne({_id: args._id});
            if(editBook){

                if((args.authorId && editBook.authorId !== args.authorId) || args.authorId === ""){
                    args.authorId = validation.checkUUID(args.authorId, 'Author ID');
                    let newAuthor = await authors.findOne({_id: args.authorId});
                    if(!newAuthor){
                        throw new GraphQLError(`This author does not exist`, {
                            extensions: {code: 'BAD_USER_INPUT'}
                          });
                    }

                    let oldAuthor = await authors.findOne({_id: editBook.authorId});
                    let oldAuthorArray = oldAuthor.books.filter(bookId => bookId !== args._id);
                    oldAuthor.books = oldAuthorArray;
                    await authors.updateOne({_id: editBook.authorId}, {$set: oldAuthor});
                    let exists = await client.exists(`Author${oldAuthor._id}`);
                    if (exists){
                        await client.del(`Author${oldAuthor._id}`);
                    }
                    
                    newAuthor.books.push(args._id);
                    await authors.updateOne({_id: args.authorId}, {$set: newAuthor});
                    exists = await client.exists(`Author${oldAuthor._id}`);
                    if (exists){
                        await client.del(`Author${newAuthor._id}`);
                    }

                    editBook.authorId = args.authorId;
                }
                else if(args.authorId && editBook.authorId === args.authorId){
                    throw new GraphQLError(`The new book author id cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                if((args.title && editBook.title !== args.title) || args.title === "" ){
                    args.title = validation.checkString(args.title, 'Title');
                    editBook.title = args.title;
                }
                else if (args.title && editBook.title === args.title){
                    throw new GraphQLError(`The new book title cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                if(args.genres && (JSON.stringify(editBook.genres) !== JSON.stringify(args.genres))){
                    if (args.genres.length === 0){
                        throw new GraphQLError(`The new book genres cannot be empty`, {
                            extensions: {code: 'BAD_USER_INPUT'}
                        });
                    }
                    let newArray = []
                    for (let genre of args.genres){
                        genre = validation.checkString(genre, 'Genre');
                        newArray.push(genre);
                    }
                    editBook.genres = newArray;
                }
                else if(args.genres && (JSON.stringify(editBook.genres) === JSON.stringify(args.genres))){
                    throw new GraphQLError(`The new book genres cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                if((args.publicationDate && editBook.publicationDate !== args.publicationDate) || args.publicationDate === ""){
                    args.publicationDate = validation.checkDate(args.publicationDate);
                    editBook.publicationDate = args.publicationDate;
                }
                else if ( args.publicationDate && editBook.publicationDate === args.publicationDate){
                    throw new GraphQLError(`The new book publication date cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                if((args.publisher && editBook.publisher !== args.publisher) || args.publisher === ""){
                    args.publisher = validation.checkString(args.publisher, 'Publisher');
                    editBook.publisher = args.publisher;
                }
                else if (args.publisher && editBook.publisher === args.publisher){
                    throw new GraphQLError(`The new book publisher cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                if((args.summary && editBook.summary !== args.summary) || args.summary === ""){
                    args.summary = validation.checkString(args.summary, 'Summary');
                    editBook.summary = args.summary;
                }
                else if (args.summary && editBook.summary === args.summary){
                    throw new GraphQLError(`The new book summary cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                if((args.isbn && editBook.isbn !== args.isbn) || args.isbn === ""){
                    args.isbn = validation.checkIsbn(args.isbn);
                    editBook.isbn = args.isbn;
                }
                else if (args.isbn && editBook.isbn === args.isbn){
                    throw new GraphQLError(`The new book isbn cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                if ((args.language && editBook.language !== args.language) || args.language === ""){
                    args.language = validation.checkString(args.language, 'Language');
                    editBook.language = args.language;
                }
                else if (args.language && editBook.language === args.language){
                    throw new GraphQLError(`The new book langauge cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                if((args.pageCount && editBook.pageCount !== args.pageCount) || args.pageCount === 0){

                    if (args.pageCount <= 0){
                        throw new GraphQLError(`The new book page count cannot be less than 0`, {
                            extensions: {code: 'BAD_USER_INPUT'}
                        });
                    }
                    editBook.pageCount = args.pageCount;
                }
                else if (args.pageCount && editBook.pageCount === args.pageCount){
                    throw new GraphQLError(`The new book page count cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                if((args.price && editBook.price !== args.price) || args.price === 0){
                    if (args.price <= 0){
                        throw new GraphQLError(`The new book price cannot be less than 0`, {
                            extensions: {code: 'BAD_USER_INPUT'}
                        });
                    }
                    editBook.price = args.price;
                }
                else if (args.price && editBook.price === args.price){
                    throw new GraphQLError(`The new book price cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                if(args.format && (JSON.stringify(editBook.format) !== JSON.stringify(args.format))){
                    if (args.format.length === 0){
                        throw new GraphQLError(`The new book format cannot be empty`, {
                            extensions: {code: 'BAD_USER_INPUT'}
                        });
                    }
                    let newArray = []
                    for (let format of args.format){
                        format = validation.checkString(format, 'format');
                        newArray.push(format);
                    }
                    editBook.format = newArray;
                }
                else if(args.format && (JSON.stringify(editBook.format) === JSON.stringify(args.format))){
                    throw new GraphQLError(`The new book genres cannot be the same`, {
                        extensions: {code: 'BAD_USER_INPUT'}
                    });
                }

                await books.updateOne({_id: args._id}, {$set: editBook});
            }
            else{
                throw new GraphQLError(`Could not Find Book with an ID of ${args._id}`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            await client.set(`Book${editBook._id}`, JSON.stringify(editBook));

            return editBook;

        }, 
        removeBook: async(_, args) => {
            const authors = await authorCollection();
            const books = await bookCollection();

            let authorsWithBook = await authors.find({books: {$in: [args._id]}}).toArray();
            for (let authorWithBook of authorsWithBook){
                let newArray = authorWithBook.books.filter(bookId => bookId !== args._id);
                authorWithBook.books = newArray; 
                await authors.updateOne({_id: authorWithBook._id}, {$set: authorWithBook});
            }
            console.log("removed the book id from all the respective authors");

            let deletedBook = await books.findOneAndDelete({_id: args._id});
            if (!deletedBook) {
                throw new GraphQLError(
                  `Could not delete book with _id of ${args._id}`,
                  {
                    extensions: {code: 'NOT_FOUND'}
                  }
                );
            }
            let exists = await client.exists(`Book${deletedBook._id}`);
            if(exists){
                await client.del(`Book${deletedBook._id}`);
            }
            return deletedBook;
        }
    }
}