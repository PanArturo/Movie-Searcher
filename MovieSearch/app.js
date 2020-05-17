// importing and instantiating express framework
const express = require('express');
const app = express();

// request package to use APIs
const request = require('request');
const port = 3000;

// package needed to set up req.flash to handle errors
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());

app.set("view engine", "ejs");

// let express serve the "public" directory to link the style sheets
app.use(express.static("public"));

// Get route "/" for search page
app.get("/", function(req, res){
	res.render("search")
});

// Get route "/result" for result page
app.get("/result", function(req, res){
	var search = req.query.search;
	var url = "http://www.omdbapi.com/?apikey=thewdb&s=" + search;
	request(url, function(error, response, body){
		var data = JSON.parse(body);
		 if(!data["Error"] && response.statusCode == 200)
    		res.render("result",{data: data});
    	 else {
			req.flash("error", data["Error"])
          	res.redirect("/");
        }
	});
});

// Get route "*" for any other arbitrary page
app.get("*", function(req, res){
	res.send("You are no where.")
});

// express listen for requests
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
