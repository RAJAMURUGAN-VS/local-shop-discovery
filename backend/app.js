const express = require('express')
const app = express()
app.use(express.json())

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')
const dbPath = path.join(__dirname, 'local_shop_discovery.db')
let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is Running at http://localhost:3000')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authenticateToken = (request, response, next) => {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        request.username = payload.username
        next()
      }
    })
  }
}

app.post('/register/', async (request, response) => {
  const {username, password, name, gender} = request.body
  const getUserQuery = `
    SELECT * FROM user WHERE username='${username}'
  `
  const dbUser = await db.get(getUserQuery)

  if (dbUser !== undefined) {
    response.status(400)
    response.send('User already exists')
  } else if (password.length < 6) {
    response.status(400)
    response.send('Password is too short')
  } else {
    const hashedPassword = await bcrypt.hash(password, 10)
    const postUserQuery = `
            INSERT INTO user (username,password,name,gender)
            VALUES ('${username}','${hashedPassword}','${name}','${gender}')
        `
    await db.run(postUserQuery)
    response.status(200)
    response.send('User created successfully')
  }
})

app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const getUserQuery = `
    SELECT * FROM user WHERE username='${username}'
  `
  const dbUser = await db.get(getUserQuery)
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatched === false) {
      response.status(400)
      response.send('Invalid password')
    } else {
      const payload = {
        username: username,
      }
      const jwtToken = jwt.sign(payload, 'SECRET_TOKEN')
      response.send({jwtToken})
    }
  }
})