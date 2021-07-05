const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../model/user')
const Hospital = require('../model/hospital')
const District = require('../model/district')
const State = require('../model/state')
const Country = require('../model/country')

exports.signIn = async (req,res) => {

    if(req.body.email == '' || req.body.password == '') {
        res.status(400).json({message: "No field can be empty!"});
        console.log('field empty')
        return;
    }
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({user, token})
    }
    catch(error){
        console.log(error)
        res.status(400).send(error)
    }
}

exports.signUp = async (req, res) => {
    console.log(req.body)
    if(req.body.email == '' || req.body.password == '') {
        res.status(400).json({message: "No field can be empty!"});
        console.log('field empty')
        return;
    }
    const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        tokens: [],
    })
    try{
        const token = await newUser.generateToken()
        res.status(201).send({newUser, token})
    }
    catch(e){
        res.status(400).send(e)
    }
}

exports.signOut = async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((tokenObject) => tokenObject.token != req.token)
        await req.user.save()
        res.send('Signed Out')
    }
    catch(e){
        res.status(500).send(e)
    }
}

exports.signOutAll = async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send('Signed Out from All Sessions')
    }
    catch(e){
        res.status(500).send(e)
    }
}

exports.updateAdmin = async (req,res)=>{


    if(req.user.isAdmin){
        const username = req.params.username;
        console.log(username);
        User.findByIdAndUpdate(req.params.userId,{$set:{isAdmin:true}},{new:true})
        .then(data=> {
            if(!data) {
                res.status(404).send({
                    message: `cannot update author with  Maybe uer not found`
                }) 
            } else {
                
                res.send(data);
            }
        })
        .catch(err=> {
            res.status(500).send({
                message: `Error update author information`
            })
        })
    }
    else{
        res.end("You are not authorized to perform this operation");
    }
}

exports.getCountry = async (req,res) => {
    const countryName = req.params.countryName

    Country.findOne({ Country: countryName })
    .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot find country with this name. Maybe name is wrong`,
          })
        } else {
          res.json(data)
        }
    })
}

exports.getStates = async (req, res) => {
    const countryName = req.params.countryName
    const stateName = req.params.stateName
    
    State.find({ Country: countryName }).then((data) => {
        if (!data) {
        res.status(404).send({
            message: `Cannot find country with this name. Maybe name is wrong`,
        })
        } else {
        res.json(data)
        }
    })
}

exports.getOneState = async (req, res) => {
  const countryName = req.params.countryName
  const stateName = req.params.stateName

  State.findOne({ Country: countryName, State: stateName }).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find country with this name. Maybe name is wrong`,
      })
    } else {
      res.json(data)
    }
  })
}

exports.getDistricts = async (req, res) => {
  const countryName = req.params.countryName
  const stateName = req.params.stateName

  District.find({ Country: countryName, State: stateName }).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find country with this name. Maybe name is wrong`,
      })
    } else {
      res.json(data)
    }
  })
}

exports.getOneDistrict = async (req, res) => {
  const stateName = req.params.stateName
  const districtName = req.params.districtName

  District.findOne({ State: stateName, District: districtName }).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find country with this name. Maybe name is wrong`,
      })
    } else {
      res.json(data)
    }
  })
}

exports.getHospital = async (req, res) => {
    console.log('Hello')
  Hospital.find({})
  .then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot find country with this name. Maybe name is wrong`,
      })
    } else {
      res.json(data)
    }
  })
}

exports.getOneHospital = async (req, res) => {
  const hospitalName = req.params.hospitalName

  Hospital.findOne({ Hospital: hospitalName }).then(
    (data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find country with this name. Maybe name is wrong`,
        })
      } else {
        res.json(data)
      }
    }
  )
}

