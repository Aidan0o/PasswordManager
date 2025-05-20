const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname)));

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000/MainPage.html");
});//when the node is run, opens the data on a server
app.use(express.static("./FrontEnd"));
async function getData(req, res) {
  db.all(`SELECT * FROM EncryptedData`, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows); // Send all password entries to frontend
  });
}










const sqlite3 = require('sqlite3').verbose();
// Crypto hashes
const crypto = require('crypto'); 

const dbPath = "C:\\Users\\willt\\OneDrive\\Documents\\GitHub\\PasswordManager\\User Interface and C code\\passwords.db";
// const dbPath = "C:\\Users\\User\\Documents\\GitHub\\PasswordManager\\User Interface and C code\\passwords.db";

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to database');
  }
});

//generate salt
function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

//password + salt
function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

//new user function
function createUser(name, password) {
  const salt = generateSalt();
  const hash = hashPassword(password, salt);

  db.run(
    // Insert Staff member into DB with Hashed password
    `INSERT INTO Staff (Name, SALT, PSRD_HASH) VALUES (?, ?, ?)`,
    [name, salt, hash],
    function (err) {
      if (err) {
        return console.error('Error inserting:', err.message);
      }
      console.log(`User '${name}' added with ID ${this.lastID}`);
    }
  );
}

//verify login function
function verifyUser(name, password) {
  db.get(`SELECT * FROM Staff WHERE Name = ?`, [name], (err, row) => {
    if (err) return console.error(err.message);
    if (!row) return console.log('User not found');

    const hash = hashPassword(password, row.SALT);
    if (hash === row.PSRD_HASH) {
      console.log('Password is correct');
    } else {
      console.log('Invalid password');
    }
  });
}
async function ReceivePassword(request, response) {
  verifyUser(request[0], request[1]);//calls login with the data stored in the list that request should be
}
// --- EXAMPLES ---
// Create a user (run once)
// createUser('BILLYBOBBY', 'DELTASIERRA');

// Test login
// verifyUser('alice', 'mypassword123'); //
// verifyUser('alice', 'wrongpassword'); //
verifyUser('BILLYBOBBY', 'DELTASIER');
app.get("/passwords", getData);//This makes the function getData read from another file and output the data into it
app.post("/getTestData", ReceivePassword);