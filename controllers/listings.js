const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { listings: allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/form.ejs");
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
 
  if (!listing) {
    req.flash("error", "Listing you are trying to access do not exist");
    res.redirect("/listings");
  }


  res.render("listings/show.ejs", { listing });
  // console.log(listing, listing.image);
};

module.exports.createListing = async (req, res, next) => {

  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
 
  console.log(req.body);
 
  const url = req.file.path;
  const  filename  = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save().then((res) => console.log(res));
  req.flash("success", "New Listing Added");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
  console.log("works");
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", 'Listing you are trying to access do not exist');
    res.redirect("/listings");
  }
  let originalURL = listing.image.url;
  originalURL = originalURL.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing,originalURL });
};

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  

  let upDatedListing = req.body.listing;
  console.log(upDatedListing);
  
  // Find the Listing document and update it
  let listing = await Listing.findByIdAndUpdate(id, upDatedListing);
 

  if (typeof req.file != 'undefined') {
     const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success","Your listing has been updated!");

  // Redirect to the listings page
  res.redirect(`/listings`);
};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  const deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "listing deleted!");
  res.redirect("/listings");
};
