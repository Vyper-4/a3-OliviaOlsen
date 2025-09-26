require('dotenv').config();
const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

//Remove this later for security, use env file isntead
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = 'cs4241a3';

let db, records, users;

async function main() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  records = db.collection('records');
  users = db.collection('users');

  console.log('Connected to MongoDB');

  //start server after DB connection
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main().catch(err => console.error(err));

app.use(express.json());
//Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

//login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

//loginAttempt route
app.post('/loginAttempt', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing username or password");

  const user = await users.findOne({ username });

  if (!user) {
    await users.insertOne({ username, password });
    return res.send("Welcome!");
  } else if (user.password === password) {
    return res.send("Welcome back!");
  } else {
    return res.status(401).send("Login failed");
  }
});

//changeUsername route
app.post('/changeUsername', async (req, res) => {
  const { oldUsername, newUsername, password } = req.body;
  if (!oldUsername || !newUsername || !password)
    return res.status(400).send("Missing information");

  const user = await users.findOne({ username: oldUsername });
  if (!user) return res.status(401).send("No user by that name");
  if (user.password !== password)
    return res.status(401).send("Incorrect username or password");

  //Update username in users collection
  await users.deleteOne({ username: oldUsername });
  await users.insertOne({ username: newUsername, password });

  //Update records that reference this holder
  await records.updateMany(
    { holder: oldUsername },
    { $set: { holder: newUsername } }
  );

  return res.send("Changed!");
});

//GET all records
app.get('/data', async (req, res) => {
  const allRecords = await records.find().toArray();
  res.json(allRecords);
});

//Add a new record
app.post('/submit', async (req, res) => {
  try {
    const newRecord = req.body;
    newRecord.year = Number(newRecord.year);
    newRecord.currentlyHeld = false;

    //Check if this record should become the current holder
    const current = await records.findOne({
      record: newRecord.record,
      currentlyHeld: true
    });

    if (!current || newRecord.year >= current.year) {
      newRecord.currentlyHeld = true;
      if (current) {
        await records.updateOne(
          { _id: current._id },
          { $set: { currentlyHeld: false } }
        );
      }
    }

    await records.insertOne(newRecord);
    res.status(200).send('Record added!');
  } catch (err) {
    console.error('Insert Error:', err);
    res.status(400).send('Invalid JSON');
  }
});

//Remove a record
app.post('/expunge', async (req, res) => {
  try {
    const { record, holder, year } = req.body;
    const toRemove = await records.findOne({ record, holder, year: Number(year) });
    if (!toRemove) return res.status(200).send('Record not found.');

    const wasHeld = toRemove.currentlyHeld;
    await records.deleteOne({ _id: toRemove._id });

    if (wasHeld) {
      const mostRecent = await records
        .find({ record })
        .sort({ year: -1 })
        .limit(1)
        .next();
      if (mostRecent) {
        await records.updateOne(
          { _id: mostRecent._id },
          { $set: { currentlyHeld: true } }
        );
      }
    }
    res.status(200).send('Record removed.');
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(400).send('Invalid JSON');
  }
});

//Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

