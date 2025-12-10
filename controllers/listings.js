const express = require('express');

const router = express.Router();
const Listing = require('../models/listing');

router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().populate('owner');

    res.render('listings/index.ejs', { listings });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Create
router.get('/new', async (req, res) => {
  try {
    res.render('listings/new.ejs');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id;
    await Listing.create(req.body);
    res.redirect('/listings');
  } catch (error) {
    console.error(error);
    res.redirect('/listings/new');
  }
});

// Update

// Show
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner');
    res.render('listings/show.ejs', { listing });
  } catch (error) {
    console.error(error);
    res.redirect('/listings');
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const isOwner = listing.owner.equals(req.session.user._id);

    if (isOwner) {
      await listing.deleteOne();
      res.redirect('/listings');
    } else {
      throw new Error(`Permission Denied to ${req.session.user.username}`);
    }
  } catch (error) {
    console.error(error);
    res.redirect('/listings');
  }
});

//Edit
router.get("/:id/edit" , async (req,res)=>{
  try{
const listing = await Listing.findById(req.params.id)
  res.render("listings//edit.ejs" , {listing})
  }
  catch(error){
    console.error(error)
    res.redirect('/listings');
  }
  
})

router.put("/:id" , async(req , res) =>{
  try{
    //find the currend listing
    const listing = await Listing.findById(req.params.id)
    const isOwner = listing.owner.equals(req.session.user._id)
    //check if the loggen in user
    if(isOwner){
      console.log(req.body)
      console.log(listing)

      //edit
      await listing.updateOne(req.body)
      //redirect
      res.redirect(`/listings/${req.params.id}`);
    }
    else{
      console.log("NOT OWNER")
      res.redirect(`/listings/${req.params.id}`);
    }
  }
  catch(error){
    console.error(error)
    res.redirect('/listings');
  }
})

module.exports = router;
