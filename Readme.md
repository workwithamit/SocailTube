# Notes

### 1. database se connect krne pr error aa skta h toh wrap it in try catch or promise se resolve reject mai ho jayega mamla solve

### 2. Database is in the other continent mtlb it is async, so use it's better to use async await

### There are diffrent approaches for connecting to db, either you can put your code into db folder or directly in index.js(main file which will be executed by nodemon or node)

### we can declare a function connectDB and call it , another method is using iife

### iife ;(async ()=>{})() , good practice to use semicolon before using iife for better code readability
