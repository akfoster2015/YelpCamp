var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Campground 	= require("./models/campground"),
	Comment		= require("./models/comment"),
	seedDB		= require("./seeds");



mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", {useNewUrlParser: true});
				 

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
seedDB();

// =======================================================
// ROUTES	
// =======================================================

app.get("/", function(req, res){
	res.render("landing");
});


// INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res){
// 	Get all campgrounds from DB
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("index", {campgrounds: allcampgrounds});
		}
	});
});


// CREATE - add new campground to db
app.post("/campgrounds", function(req, res){
	// 	get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// 	redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});


// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("new");
});

// SHOW - show info for one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
			console.log(foundCampground);
            //render show template with that campground
            res.render("show", {campground:foundCampground});
        }
    });
});



// =======================================================
// SERVER	
// =======================================================
	
app.listen(3000, function(){
	console.log("The YelpCamp server listening on port 3000");
});
