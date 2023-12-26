# Notes

### 1. database se connect krne pr error aa skta h toh wrap it in try catch or promise se resolve reject mai ho jayega mamla solve

### 2. Database is in the other continent mtlb it is async, so use it's better to use async await

### There are diffrent approaches for connecting to db, either you can put your code into db folder or directly in index.js(main file which will be executed by nodemon or node)

### we can declare a function connectDB and call it , another method is using iife

### iife ;(async ()=>{})() , good practice to use semicolon before using iife for better code readability

### aggregation pipeline in mongoDB (very interesting topic in mongoDB)

### there are different types of middlewares like pre post etc...

### you can code them for like delete ho toh ye krdo, ye ho toh kuchh krdo and all

### bcrypt = helps you hash your password

### JWT = JSON WEB TOKEN

### direct encryption krna possible h nahi, toh hum kya krenge, so we will take help of hooks(middleware) in mongoose like pre hook

### pre middleware: functions are executed one after another, when each middleware calls next.

# jwt is a bearer token (kindaa chabi)
