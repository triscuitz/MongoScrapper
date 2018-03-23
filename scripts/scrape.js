//scrapes ign.com/articles
app.get('/scrape', function(req, res) {
  axios.get('http://www.ign.com/articles?tags=news').then(function(response) {
    let $ = cheerio.load(response.data);

    //grabs the headlines of all the articles on the page
    $('a.listElmnt-storyHeadline').each(function(i, element) {

      let result = {};

      //grabs the headline text and link and puts them in the result object
      result.title = $(this).children('a').text();
      result.link = $(this).children('a').attr('href');

      //creates new articles from what was just scrapped
      db.Headline.create(results)
        .then(function(dbHeadline) {
          console.log(dbHeadline);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send('Scrape Complete');
  });
});
