const { query } = require("express");
const State = require("../model/State");
const verifyStates = require("../middleware/verifyStates");

const getAllStates = async (req, res) => {
  //const states = statesData;
  var states = require('../model/statesData.json');

  console.log(states);
  if (!states) return res.status(204).json({ message: "get all states: No states found." });
  res.json(states);
}

const getState = async (req, res) => {
    var reqState = req.params.code; //get the uri statecode 
    reqState = reqState.toUpperCase();  //turn the requested statecode to uppercase
    
    if (/*verifyStates(reqState, res) != true*/false) { //if it returns a false
        //console.log(false);
        return res.status(400).json({ 'message': 'get state: not a real state'})
    }

    var states = require('../model/statesData.json');
    const stateCodes = states.filter(req => req.code).map(element => element.code);
    var state = states.filter(function(element) {
        return element.code == reqState;
    });    //find state by statecode in states
  
    if (!state) return res.status(204).json({ message: "get state: No states found." });
    res.json(state);
  }

const postFunFacts = async (req, res) => {
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'at least one funfact is required to post'})
    }
    try {
        const result = await State.updateOne(
            {stateCode: req.body.code},
            {$addToSet: {funfacts: req.body.funfacts}},  //add to the array but don't allow duplicates
        );
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const patchFunFacts = async (req, res) => {
    if(!req?.body?.index) { //index here cannot be zero-based or it may fail this check by being at index zero
        return res.status(400).json({ 'message': 'fun fact at this index does not exist'})
    }
    try {
        const index = req.body.index-1; //fix index to be zero based now
        console.log(req.params.code);

        const result = await State.findOneAndUpdate(
            {stateCode: req.params.code},               //CHANGE THIS
            { $set: {funfacts: req.body.funfacts}}, 
            {arrayFilters: [ { $position: index } ], returnNewDocument: true} ,
        );
            
        res.status(201).json(result);
    } catch(err) {
        console.error(err);
    }
}

/*
const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await employee.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    }
    res.json(employee);
}
*/
module.exports = {
    getAllStates,
    getState,
    postFunFacts,
    patchFunFacts
}
