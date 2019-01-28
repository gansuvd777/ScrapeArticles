const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

module.exports = app => {
    // Homepage/Default route
    app.get("/", (req, res) => {
        res.render("index")
    });
    app.get("/api/scrape", (req, res) => {
        const results = [];
        axios.get("http://www.pbs.org/parents/parenting/").then(response => {
            const $ = cheerio.load(response.data);
            $("div.module-646 left-module-646").each((i, element) => {
                console.log("WE FOUND AN ELEMENT", element);
                const title = $(element).find("h4").text().trim();
                const link = $(element).find("a").attr("href");
                const img = $(element).find("a").find("img").attr("alt srcset").split(",")[0].split(" ")[0];;
                const articleCreated = moment().format("YYYY MM DD hh:mm:ss");

                const result = {
                    title: title,
                    link: link,
                    img: img,
                    // articleCreated: articleCreated,
                    isSaved: false
                };

                results.push(result);
            });
        }).catch(err  => console.log(err));

        res.json(results);
    });
    // A GET route for scraping website
    app.get("/scrape", (req, res) => {
        axios.get("http://www.pbs.org/parents/parenting/").then(response => {
            const $ = cheerio.load(response.data);
            $("div.module-646 left-module-646").each((i, element) => {
                const title = $(element).find("h4").text().trim();
                const link = $(element).find("a").attr("href");
                const img = $(element).find("a").find("img").attr("alt srcset").split(",")[0].split(" ")[0];;
                const articleCreated = moment().format("YYYY MM DD hh:mm:ss");

                const result = {
                    title: title,
                    link: link,
                    img: img,
                    // articleCreated: articleCreated,
                    isSaved: false
                };

                console.log(result)

                db.Article.findOne({ title: title })
                    .then(data => {
                        // console.log(data);
                        if (data === null) {
                            db.Article.create(result)
                                .then(function (dbArticle) {
                                    res.json(dbArticle)
                                });
                        }
                    }).catch(err => {
                        res.json(err)
                    })
            });

        });
        // All found articles on DOM
        db.Article.find({ isSaved: false })
            .then(dbArticle => {
                res.render("scrape", { article: dbArticle })
            })
            .catch(err => {
                res.json(err)
            })

    });
    //Route to post saved Articles in db
    app.post("/saved", (req, res) => {
        db.Article.create(req.body)
            .then(dbArticle => {
                res.json(dbArticle)
            }).catch(err => {
                res.json(err)
            });
    });

    // Route for getting all saved Articles from db and render it on saved page
    app.get("/saved", (req, res) => {
        db.Article.find({ isSaved: true })
            .then(dbArticle => {
                res.render("saved", { savedArticle: dbArticle });
            })
            .catch(err => {
                res.json(err)
            })
    });

    //Route to Delete Articles
    app.delete("/saved/:id", (req, res) => {
        db.Article.deleteOne({ _id: req.params.id })
            .then(removed => {
                res.json(removed);
            }).catch(err => {
                res.json(err);
            });
    });


    // Route for grabbing a specific Article by id
    app.get("/articles/:id", (req, res) => {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(dbArticle => {
                res.json(dbArticle)
            }).catch(err => {
                res.json(err)
            })
    });


    //Route to post notes in db
    app.post("/articles/:id", (req, res) => {
        db.Note.create(req.body)
            .then(dbNote => {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
            })
            .then(dbArticle => {
                console.log(dbArticle);
                res.json(dbArticle)
            }).catch(err => {
                res.json(err)
            })
    });


    // Route for deleting article
    app.delete("/articles/:id", (req, res) => {
        db.Note.deleteOne({ _id: req.params.id })
            .then(remove => {
                res.json(remove)
            }).catch(err => {
                res.json(err)
            })
    });
}