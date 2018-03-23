//route for getting articles from db
app.get('/headlines', function(req, res) {
  db.Headline.find({})
    .then(function(dbHeadline) {
      res.json(dbHeadline);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//route for getting an article by id
app.get('/headlines/:id', function(req, res) {
  db.Headline.findOne({ _id: req.params.id })
    .populate('note')
    .then(function(dbHeadline) {
      res.json(dbHeadline);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//route for saving/updating notes for Articles
app.post('/headlines/:id', function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbHeadline) {
      res.json(dbHeadline);
    })
    .catch(function(err) {
      res.json(err);
    });
});
