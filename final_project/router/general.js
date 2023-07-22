const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //old non promise based task 1 
    //return res.send(JSON.stringify(books,null,4));

    //task 10
    const promise = new Promise((resolve,reject) => {
        resolve(books)
      });

    return promise.then((result) => {
        return res.send(JSON.stringify(result));
    }).catch((err) => {
        return res.status(404).json(err);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //old non promise based task 2
    //const isbn = req.params.isbn
    //const book = Object.values(books).find((book) => book.isbn === isbn)
     //return res.send(JSON.stringify(book));

     //Task 11
     const isbn = req.params.isbn

     const promise = new Promise((resolve,reject) => {
         const book = Object.values(books).find((book) => book.isbn === isbn)
         resolve(book)
      });

    return promise.then((result) => {
        return res.send(JSON.stringify(result));
    }).catch((err) => {
        return res.status(404).json(err);
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //old non promise based task 3
    //const author = req.params.author
    //const booksArr = Object.values(books).filter((book) => book.author === author)
    //return res.send(JSON.stringify(booksArr));

    //task 12
    const author = req.params.author

    const promise = new Promise((resolve,reject) => {
        const booksArr = Object.values(books).filter((book) => book.author === author)
        resolve(booksArr)
     });

   return promise.then((result) => {
       return res.send(JSON.stringify(result));
   }).catch((err) => {
       return res.status(404).json(err);
   });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //old non promise based task 4
    //const title = req.params.title
    //const booksArr = Object.values(books).filter((book) => book.title === title)
    //return res.send(JSON.stringify(booksArr));

    const title = req.params.title
    const promise = new Promise((resolve,reject) => {
        const booksArr = Object.values(books).filter((book) => book.title === title)
        resolve(booksArr)
     });

     return promise.then((result) => {
        return res.send(JSON.stringify(result));
    }).catch((err) => {
        return res.status(404).json(err);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const reviews = Object.values(books).find((book) => book.isbn === isbn).reviews
    return res.send(JSON.stringify(reviews));
});

module.exports.general = public_users;
