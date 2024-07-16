const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

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

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Please login"});
    } else {
      return res.status(404).json({message: "User already exists"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return new Promise((resolve, reject) => {
    if (!resolve) {
        res.status(400).json({message: "Error "})
        reject()
    } else {
        
        res.status(200).send(JSON.stringify(books))
        resolve()
    }
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    return new Promise((resolve, reject) => {
        if (!req.params.isbn) {
            res.status(400).json({message: "Error "})
            reject()
        } else {
            res.status(200).send(books[req.params.isbn])
            resolve()
        }
    })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return new Promise((resolve, reject) => {
    if (!req.params.author) {
        res.status(400).json({message: "Oops! There's an error somewhere! "})
        reject()
    } else {
        let ans = []
        for(const [key, values] of Object.entries(books)){
            const book = Object.entries(values);
            for(let i = 0; i < book.length ; i++){
                if(book[i][0] == 'author' && book[i][1] == req.params.author){
                    ans.push(books[key]);
                }
            }
        }
        res.send(ans)
        resolve()
    }
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    return new Promise((resolve, reject) => {
        if (!req.params.title) {
            return res.status(400).json({message: "Title not found"});
            reject()
        } else {
            let ans = []
            for(const [key, values] of Object.entries(books)){
                const book = Object.entries(values);
                for(let i = 0; i < book.length ; i++){
                    if(book[i][0] == 'title' && book[i][1] == req.params.title){
                        ans.push(books[key]);
                    }
                }
            }
            res.send(ans);
        }
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});

module.exports.general = public_users;
