const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("build"));
app.use(express.json()); // auto JSON.parse the req.body
let listItems = [];

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'todolist';
const mongoClient = new MongoClient(url);
let db;
let collection;

const bcrypt = require('bcrypt');
const saltRounds = 5;

/* FOR INITIAL CONNECTION TO DB */
mongoClient.connect((err) => {
    if (err) {
        console.log("[MongoDB] Mongo client could not connect to DB server: " + err);
    } else {
        db = mongoClient.db(dbName);
        // later, we will need to assign collection base on the user login
        app.listen(port, (err) => {
            if (err) {
                console.log("Node server cannot start: " + err);
            } else {
                console.log(`server ready on http://localhost:${port}`);
            }
        });
    }
});

/*  FOR LOGIN AND SIGNUP */
/* for login, there are a few things to consider
1) Whether the username exist
    if yes, does the password match?
    else, return a response that "Need to signup"    
*/
app.post('/login', (req, res) => {
    console.log("LOGIN request");
    collection = db.collection('userCollection');
    
    collection.find({username: {$eq: req.body.loginUsername}}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                console.log("User does not exists");
                res.send("Username does not exists");
            } else {
                // need to check whether password match?
                bcrypt.compare(req.body.loginPassword, result[0].encryptedPassword, (err, result) => {
                    if (err) {
                        console.log(`Error during checking ${err}`);
                        res.send("Wrong password");
                    } else {
                        if (result == true) {
                            console.log("Correct password");
                            res.send("Valid username");
                        } else {
                            console.log("Wrong password");
                            res.send("Your password is wrong");
                        }
                    }
                });
            }
        }
    });
})

/* for signup, these are the points to consider
1) Whether the username alr exists?
    if yes, return a responst that "user need to choose another username"
    if no, add the signup info into the collection, res stt is successful
*/
app.post('/signup', (req, res) => {
    console.log("SIGNUP request");
    collection = db.collection('userCollection');
    collection.find({username: {$eq: req.body.signupUsername}}).toArray(function(err, result) {
        if (err) console.log(err);
        console.log(result);
        if (result.length === 0) {
            // generate hash
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) {
                    console.log(`Error during salt generation ${err}`);
                    res.send("Failed to signup!");
                } else {
                    bcrypt.hash(req.body.signupPassword, salt, (err, hash) => {
                        if (err) {
                            console.log(`Error during hashing ${err}`);
                            res.send("Failed to signup");
                        } else {
                            collection.insertOne({username: req.body.signupUsername, encryptedPassword: hash},
                                (err, result) => {
                                if (err) {
                                    console.log("Error duing insertion " + err);
                                    res.send("Failed to signup!");
                                } else {
                                    console.log("Signup succeeds");
                                    res.send("Signup is successful");
                                }
                            })
                        }
                    })
                }
            }) 
        } else {
            // username alr exists
            res.send("Username already exists");
        }
    })
    // console.log(`Username is ${req.body.signupUsername}`);
    // res.send("Signup is successful");
})

/* FOR HANDLING ADDITION TO LIST */

app.post('/initial', (req, res) => {
    console.log("INITIAL POST request");
    let currentUsername = req.body.currentUser;
    collection = db.collection(currentUsername);
    collection.find({}).toArray(function(err, result) {
        if (err) console.log(err);
        console.log(result);
        listItems = [];
        for (let item of result) {
            listItems.push({itemId: item._id, itemContent: item.toAdd});
        }
        res.json(result);
    });
})

app.post('/todolist', (req, res) => {
    console.log("POST request");
    let currentUsername = req.body.currentUser;
    collection = db.collection(currentUsername);
    collection.insertOne({_id: req.body._id, toAdd: req.body.toAdd}, (err, result) => {
        if (err) {
            console.log("Error during insertion " + err);
            res.send("Failed to insert into DB");
        } else {
            console.log("Insertion succeeds");
            collection.find({}).toArray(function(err, result) {
                if (err)
                    console.log(err);
                else
                    console.log(result);
            });
            listItems.push({itemId: result.insertedId, itemContent: req.body.toAdd});
            // for (let item of listItems) {
            //     console.log(item);
            // }
            res.send("Insertion succeeds");
        }
    })
});

app.put('/todolist', (req, res) => {
    console.log("PUT request");
    let currentUsername = req.body.currentUser;
    let updateId = req.body.itemToUpdateId;
    let updateContent = req.body.itemToUpdateContent;
    
    const newListItems = listItems.map(singleItem => singleItem.itemId === parseInt(updateId)
        ? {...singleItem, itemContent: updateContent}
        : singleItem);

    listItems = newListItems;
    // for (let item of listItems) {
    //     console.log(item);
    // }
    collection = db.collection(currentUsername);
    collection.updateOne({_id : {$eq: parseInt(updateId)}}, {$set: {toAdd: req.body.itemToUpdateContent}}, (err, result) => {
        if (err) {
            console.log("Error during update " + err);
            res.send("Failed to update from DB");
        } else {
            console.log("Update succeeds");
            collection.find({}).toArray(function(err, result) {
                if (err)
                    console.log(err);
                else
                    console.log(result);
            });
            res.send("Update succeeds");
        }
    })
})

app.delete('/todolist', (req, res) => {
    console.log("DELETE request");
    let currentUsername = req.body.currentUser;
    collection = db.collection(currentUsername);
    if (req.body.itemToDelete === "Whole list") {
        listItems = [];
        console.log(`listItems are ${listItems.join(" | ")}`);
        collection.deleteMany({}, (err, result) => {
            if (err) {
                console.log("Error during deletion " + err);
                res.send("Failed to delete from DB");
            } else {
                console.log("Deletion succeeds");
                res.send("Deletion succeeds");
            }
        })
    } else {
        listItems = listItems.filter(singleItem => {
            return singleItem.itemId !== (req.body.itemToDelete);
        })
        // for (let item of listItems) {
        //     console.log(item);
        // }
        let deleteId = req.body.itemToDelete;
        collection.deleteOne({_id: parseInt(deleteId)}, (err, result) => {
            if (err) {
                console.log("Error during deletion " + err);
                res.send("Failed to delete from DB");
            } else {
                console.log("Deletion succeeds");
                collection.find({}).toArray(function(err, result) {
                    if (err) console.log(err);
                    console.log(result);
                });
                res.send("Deletion succeeds");
            }
        })
    }  
})

/* FOR REDIRECT WHEN USER TRY TO ACCESS TODOLIST WITHOUT SIGN-IN */
app.get('/todolist/:username', (req, res) => {
    res.redirect('/');
})