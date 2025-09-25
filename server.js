const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//Starter data
let appdata = [
  { record: 'pacman', year: 2007, holder: 'Leona Zwart', currentlyHeld: true },
  { record: 'galaga', year: 2006, holder: 'Alex Olsen', currentlyHeld: true },
  { record: 'snake',  year: 2006, holder: 'Valerie Bellefontaine', currentlyHeld: true }
];

const users = {}; // user storage in the format username: password

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);

app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/loginAttempt', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing username or password");
  }

  if (!users[username]) {
    users[username] = password;
    return res.send("Welcome!");
  } else if (users[username] === password) {
    return res.send("Welcome back!");
  } else {
    return res.status(401).send("Login failed");
  }
});

app.post('/changeUsername', (req, res) => {
    const {oldUsername, newUsername, password } = req.body;

    if (!oldUsername || !newUsername || !password) {
        return res.status(400).send("Missing information");
    }

    if(!users[oldUsername]) {
        return res.status(401).send("No user by that name");
    }

    if(users[oldUsername] === password) {
        appdata.forEach(record => {
            if(record.holder.trim() === oldUsername) {
                record.holder = newUsername;
            }
        });
        delete users[oldUsername]
        users[newUsername] = password
        return res.send("Changed!")
    } else {
        return res.status(401).send("Incorrect username or password")
    }
});


// GET all records
app.get('/data', (req, res) => {
  res.json(appdata);
});

// Add a new record
app.post('/submit', (req, res) => {
  try {
    const newRecord = req.body;
    newRecord.year = Number(newRecord.year);
    newRecord.currentlyHeld = false;

    // Update currentlyHeld flags
    appdata.forEach(record => {
      if (
        newRecord.record === record.record &&
        newRecord.year >= record.year &&
        record.currentlyHeld
      ) {
        newRecord.currentlyHeld = true;
        record.currentlyHeld = false;
      }
    });

    appdata.push(newRecord);
    console.log('New:', appdata);
    res.status(200).send('Record added!');
  } catch (err) {
    console.error('JSON Parsing Error:', err);
    res.status(400).send('Invalid JSON');
  }
});

// Remove a record
app.post('/expunge', (req, res) => {
  try {
    const toRemove = req.body;
    const index = appdata.findIndex(
      record =>
        record.record === toRemove.record &&
        record.holder === toRemove.holder &&
        record.year === toRemove.year
    );

    if (index !== -1) {
      const wasHeld = appdata[index].currentlyHeld;
      appdata.splice(index, 1);

      // If the removed record was currently held, reassign
      if (wasHeld) {
        let recent = -1;
        let bestYear = -Infinity;
        appdata.forEach((record, i) => {
          if (record.record === toRemove.record && record.year > bestYear) {
            bestYear = record.year;
            recent = i;
          }
        });
        if (recent !== -1) appdata[recent].currentlyHeld = true;
      }
    } else {
      console.log('Error: Entry Not Found');
    }
    res.status(200).send('Record removed (or no change if not found).');
  } catch (err) {
    console.error('JSON Parsing Error:', err);
    res.status(400).send('Invalid JSON');
  }
});

//Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

