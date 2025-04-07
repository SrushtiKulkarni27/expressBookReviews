const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if user already exists
  const userExists = users.some(user => user.username === username);

  if (userExists) {
      return res.status(409).json({ message: "Username already exists." });
  }

  // Register user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully!" });
});

/* Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // Return all books
  return res.status(200).send(JSON.stringify(books, null, 4));
});*/

// Get all books using async-await (Task 10)
public_users.get('/', async (req, res) => {
    try {
      const getBooks = () => {
        return new Promise((resolve, reject) => {
          resolve(books);
        });
      };
  
      const allBooks = await getBooks();
      return res.status(200).json(allBooks);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });
  

/* Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn.toString()];  // Convert to string

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
 });*/

 // Get book by ISBN using async-await (Task 11)
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
  
      const getBookByISBN = () => {
        return new Promise((resolve, reject) => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject("Book not found");
          }
        });
      };
  
      const book = await getBookByISBN();
      return res.status(200).json(book);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });
  
  
/*Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase(); // Get author from route and convert to lowercase
    let matchingBooks = [];

    for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author) {
            matchingBooks.push({ isbn, ...books[isbn] });
        }
    }

    if (matchingBooks.length > 0) {
        res.status(200).json(matchingBooks);
    } else {
        res.status(404).json({ message: "No books found by this author." });
    }
});*/
// Get books by author using async-await (Task 12)
public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author.toLowerCase();
  
      const getBooksByAuthor = () => {
        return new Promise((resolve, reject) => {
          const result = Object.entries(books)
            .filter(([isbn, book]) => book.author.toLowerCase() === author)
            .map(([isbn, book]) => ({ isbn, ...book }));
  
          if (result.length > 0) {
            resolve(result);
          } else {
            reject("No books found by this author.");
          }
        });
      };
  
      const booksByAuthor = await getBooksByAuthor();
      return res.status(200).json(booksByAuthor);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });
  

/* Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleParam = req.params.title.toLowerCase();
  let matchingBooks = [];

  for (let key in books) {
    if (books[key].title.toLowerCase() === titleParam) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title." });
  }
});*/
// Get books by title using async-await (Task 13)
public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title.toLowerCase();
  
      const getBooksByTitle = () => {
        return new Promise((resolve, reject) => {
          const result = Object.entries(books)
            .filter(([isbn, book]) => book.title.toLowerCase() === title)
            .map(([isbn, book]) => ({ isbn, ...book }));
  
          if (result.length > 0) {
            resolve(result);
          } else {
            reject("No books found with this title.");
          }
        });
      };
  
      const booksByTitle = await getBooksByTitle();
      return res.status(200).json(booksByTitle);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
