const express = require("express");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const request = require("request");

mongoose.Promise = Promise;

let Note = require("../models/Note.js");
let Article = require("../models/Article.js");

module.exports = function(app) {

    // get the index page
    app.get("/", function(req, res) {
        res.render("index", {
            articles: []
        });
    });

    app.get("/scrape", function(req, res) {
        let articleId = 0;

        // First, we grab the body of the html with request
        // let hbsObject = request('https://www.nytimes.com/section/us', function(error, response, html) {
        let hbsObject = request('https://www.huffingtonpost.com/section/tv', function(error, response, html) {


            // Then, we load that into cheerio and save it to $ for a shorthand selector
            let $ = cheerio.load(html);

            let results = [];
            // Now, we grab every article tag, and do the following:
            $('div.card__headline').each(function(i, element) {
                // Save an empty result object
                let result = {};

                result.articleId = ++articleId;
                result.title = $(this).find("a").text();
                result.link = $(this).find("a").attr("href");
                if (result.title != '' && result.link != '' && result.title != undefined && result.link != undefined)
                    results.push(result);
            }); //end each

            let hbsObject = {
                articles: results
            };

            res.render("index", hbsObject);
        }); //end request


    });


    app.post("/saveArticle", function(req, res) {

        Article.find({
            title: req.body.title
        }, function(error, results) {
            if (error) {
                console.log(error);
                res.send({});
            } else {
                if (results.length == 0) {
                    let result = {};

                    result.title = req.body.title;
                    result.link = req.body.link;

                    let entry = new Article(result);
                    // Save that entry to the db
                    entry.save(function(err, doc) {
                        // Log any errors
                        if (err) {
                            console.log(err);
                        }
                        // Or log the doc
                        else {
                            console.log(doc);
                            res.send(doc);
                        }
                    });
                } else {
                    res.send(results);
                }
            }
        });

    });


    // This will get the articles we scraped from the mongoDB
    app.get("/articles", function(req, res) {


        Article.find({}, function(error, results) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            }
            // Or send the doc to the browser
            else {
                let hbsObject = {
                    articles: results
                };

                console.log("inside articles");
                res.render("index", hbsObject);

            }
        });


    });

    // Create a new note or replace an existing note
    app.post("/createNote", function(req, res) {

        Article.findOne({
            title: req.body.articleTitle
        }, function(err, article) {
            if (err) throw err;
            if (article) {
                let note = {

                    title: req.body.title,
                    body: req.body.body
                }
                let newNote = new Note(note);

                // Save the new note the db
                newNote.save(function(error, doc) {
                    // Log any errors
                    if (error) {
                        throw error;
                    }
                    // Otherwise
                    else {
                        let articleTitle = req.body.articleTitle;

                        Article.findOneAndUpdate({
                                "title": articleTitle
                            }, {
                                $push: {
                                    "notes": doc._id
                                }
                            }, {
                                new: true
                            })
                            // Execute the above query
                            .exec(function(err, doc) {
                                // Log any errors
                                if (err) {
                                    throw err;
                                } else {
                                    // Or send the document to the browser
                                    res.send(doc);
                                }
                            });
                    }
                });
            } else {
                res.send(null);
            }
        });

    });

    // Route to see notes we have added for a given article

    app.get("/seeNotes/:title", function(req, res) {

        Article.findOne({
                "title": req.params.title
            })
            // Populate all of the notes associated with it
            .populate("notes")
            // now, execute our query
            .exec(function(error, doc) {
                // Log any errors
                if (error) {
                    console.log(error);
                }
                // Otherwise, send the doc to the browser as a json object
                else {
                    console.log(doc);
                    if (doc == null)
                        res.json([]);
                    else
                        res.json(doc.notes);
                }
            });
    });

    app.post("/deleteNote/:id", function(req, res) {
        let noteId = req.params.id;
        Note.findOne({
            "_id": noteId
        }, function(error, note) {
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log(note);
                if (note == null)
                    res.json(null);
                else {
                    console.log(noteId);
                    Article.where({
                        "articleId": note.articleId
                    }).update({
                        $pullAll: {
                            "notes": [note._id]
                        }
                    }).exec();

                    note.remove();
                    res.json(note);
                }
            }

        });

    });

}
