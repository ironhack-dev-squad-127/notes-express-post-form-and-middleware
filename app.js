// app.js
const express = require('express')
const path = require('path') 
const bodyParser = require('body-parser')

const app = express()

let counter = 0

// Use a middleware that defines req.body
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// This middleware is executer for any request
app.use((req,res,next) => {
  console.log("This is my 1st middleware")
  req.fruit = "cherry"
  next() // Go to the next middleware
})

// This middleware is executer for any request
// It increments counter and give variables counters and x to the view
app.use((req,res,next) => {
  if (req.method === "GET") counter++
  res.locals.counter = counter
  res.locals.x = 42 // Give to the view a variable x that is 42
  next()
})

// This route (as any route) is a middleware that is executed only when the URL is "GET /test"
app.get('/test', (req,res,next) => {
	console.log("TCL: req.fruit", req.fruit) // We can see "cherry" thanks to the 1st middleware
  res.render('test')
})


// Route GET / (middleware that is executed only when the page is "GET /")
app.get('/', (req, res, next) => {
  res.render('index', {
    badCredentials: req.query.bad === "true"
  }) // render "views/index.hbs"
})

// // Solution 1: The user is still on POST /login
// // Route POST /login
// app.post('/login', (req, res, next) => {
//   console.log("POST /login", req.body)
//   res.render('login', {
//     isCorrect: req.body.username==='maxence' && req.body.password==='chartreuse'
//   })
// })

// Solution 2: Redirect the user after the form submission
// Route POST /login
app.post('/login', (req, res, next) => {
  let isCorrect = req.body.username==='maxence' && req.body.password==='chartreuse'
  if (isCorrect) {
    res.redirect('/success-login') // Redirect to: http://localhost:3000/success-login
  }
  else {
    res.redirect('/?bad=true')
  }
})
app.get('/success-login', (req,res,next)=> {
  res.render('success-login')
})

app.listen(3000, () => console.log('App listening on port 3000!'))
