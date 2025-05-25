const express = require('express');
const path = require('path');

const sqlite3 = require('sqlite3').verbose();
// Crypto hashes
const crypto = require('crypto'); 

const app = express();

const IV_LEN = 16; //set our IV length
// Serve static files from the Frontend folder (outside of /Backend)
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// Optional: Serve MainPage.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'Login Page.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});


async function getData(req, res) {
  db.all(`SELECT * FROM EncryptedData WHERE PSRD_ENCR IS NOT NULL` , [], (err, rows) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ error: "Database error" });
      
    }
    rows.forEach((obj) => { //will go through every object in rows 
      const encPass = obj.PSRD_ENCR; 
      const decPass = decrypt(encPass); //temp until encryption put in/test if works
      obj.PSRD_ENCR = decPass //sets the password to the decrypted version
    });
    const decryptedRows = JSON.stringify(rows) //turns rows back into JSON (one long string)
    res.json(decryptedRows); // Send all password entries to frontend
    console.log(decryptedRows);
  });
}

function encrypt(originalText) {
  const algorithm = 'aes-192-cbc' //algorithm used to encrypt the string
  const passkey = 'temp until sort hashes soon' //will be the users Hash - means user can only decrypt their own passowrds (not same key for everyone)
  const key = crypto.scryptSync(passkey, 'salt', 24); //make longer when using hash (64 or more)
  const iv = crypto.randomBytes(IV_LEN).toString('base64').slice(0, IV_LEN);   //IV is a random seed of 16 characters - plays role in encrypt/decrypt the password
  const cipher = crypto.createCipheriv(algorithm, key, iv); 
  let encrypted = cipher.update(originalText, 'utf8', 'base64'); //takes the utf-8 text, encrypts it, then converts it to base64 (base64 as its shorter than having it as hex)
  encrypted += cipher.final('base64');
  //console.log("Original text: " , originalText );
  //console.log("enryptedTextHex: ", encrypted); test purposes
  return `${iv}${encrypted}`; //merges encrypted data and iv together to be stored in db - safer as only we know length of iv so hackers not sure where password starts and iv ends
}


function addPasswordEntry(title, username, password) {
  const encPassword = encrypt(password);
  db.run(
    `INSERT INTO EncryptedData (Title, User_ENCR, PSRD_ENCR) VALUES (?, ?, ?)`,
    [title, username, encPassword],
    function (err) {
      if (err) {
        console.error("Failed to insert password:", err.message);
      } else {
        console.log(`Password for '${title}' added with ID ${this.lastID}`);
      }
    }
  );
}


app.post("/add-password", express.json(), (req, res) => {
  const { title, username, password } = req.body;
  if (!title || !username || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  addPasswordEntry(title, username, password);
  res.status(200).json({ success: true });
});


app.delete("/delete-password/:id", (req, res) => {
  const id = req.params.id;

  db.run(`DELETE FROM EncryptedData WHERE Data_ID = ?`, [id], function (err) {
    if (err) {
      console.error("Failed to delete password:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Password not found" });
    }
    console.log(`Deleted password with Data_ID: ${id}`);
    res.status(200).json({ success: true });
  });
});






// const dbPath = "C:\\Users\\willt\\OneDrive\\Documents\\GitHub\\PasswordManager\\Backend\\passwords.db";
const dbPath = "C:\\Users\\aidan\\Documents\\GitHub\\PasswordManager\\Backend\\passwords.db";

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
  console.log("function passed")
  db.get(`SELECT * FROM Staff WHERE Name = ?`, [name], (err, row) => {
    if (err) return console.error(err.message);
    if (!row) return console.log('User not found');

    const hash = hashPassword(password, row.SALT);
    if (hash === row.PSRD_HASH) {
      console.log('Password is correct');
      return true;
    } else {
      console.log('Invalid password');
    }
  });
  return false;
}
async function ReceivePassword(request, response) {
  console.log("still success")
  let x=verifyUser(request.uID, request.password);//calls login with the data stored in the list that request should be
  console.log("continued success")
  response.send(
    x
  )
}



// nonce~password
// const [iv, encPass] = password.split("~")


function decrypt(encryptedText) {
  const algorithm = 'aes-192-cbc'; //algorithm used to encrypt the string
  const passkey = 'temp until sort hashes soon'; //will be the users Hash - means user can only decrypt their own passowrds (not same key for everyone)
  const key = crypto.scryptSync(passkey, 'salt', 24); //make longer when using hash (64 or more)
  const iv = encryptedText.slice(0, IV_LEN); //seperate password from iv
  const encPass = encryptedText.slice(16); 
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encPass, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  //console.log("Original text: " , decrypted );
  //console.log("enryptedTextHex: ", encryptedText); test purposes
  return decrypted;
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

