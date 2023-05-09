const { query } = require("express");
const State = require("../model/State");
const states = require('../model/statesData.json');
const verifyStates = require("../middleware/verifyStates");
const verifyStates2 = require("../middleware/verifyStates2");

const getAllStates = async (req, res) => {
  //const states = statesData;
    if (req.params.contig == true) {
        //state data for 48, excluding AK & HI

    } else if (req.params.contig == false) {
        //state data for AK and HI

    }
  if (!states) return res.status(204).json({ message: "get all states: No states found." });
  res.json(states);
}

const getState = async (req, res) => {
    //verifyStates(req, res); //res gets changed here to be used below
    
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = 0;
    isState = stateCodes.find(element => element == stateCode);
    console.log(isState);
    console.log(isState);
    console.log(isState);
    if(isState == null) {
        return res.status(204).json({ message: "get state: No state found." });
    }

    //get state to respond with
    const stateRes = states.find(function(element) { 
        return element.code == stateCode;
    });  
    console.log(stateRes);
    
    if (!stateRes) return res.status(204).json({ message: "get state: No states found." });
    res.json(stateRes);
} 

const getFunFact = async (req, res) => {
    //check if statecode is valid
    //verifyStates(req, res); //res gets changed here to be used below
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = stateCodes.find(element => element == stateCode);
    if(isState == null) {
        return res.status(204).json({ message: "get state: No state found." });
    }

    //retrieve a funfact for state using res.code
    const funFact = await State.findOne({ stateCode: res.code }).exec(); //find state in mongoDB
    if (!funFact) {
        return res.status(204).json({ "message": `No state matches ${res.code}.` });
    }

    const randomNum = Math.floor(Math.random() * 3);
    console.log(funFact);
    const fact = funFact.funfacts[randomNum];
    res.json(fact);
}

const getCapital = async (req, res) => {
    //check if statecode is valid
    //verifyStates(req, res); //res gets changed here to be used below
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = stateCodes.find(element => element == stateCode);
    if(isState == null) {
        return res.status(204).json({ message: "get state: No state found." });
    }

    const stateRes = states.find(function(element) { //stateRes becomes the state
        return element.code == stateCode;
    }); 
    //console.log(stateRes);  
    if (!stateRes) return res.status(204).json({ message: "get state: No states found." });
    //access state capital

    const capital = stateRes.capital_city;
    const stateName = stateRes.state;
    console.log(capital);
    res.json({'state':stateName,'capital':capital});
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
    //check if statecode is valid
    //verifyStates(req, res); //res gets changed here to be used below
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = stateCodes.find(element => element == stateCode);
    if(isState == null) {
        return res.status(204).json({ message: "get state: No state found." });
    }
    
    if(!req?.body?.index) { //index here cannot be zero-based or it may fail this check by being at index zero
        return res.status(400).json({ 'message': 'index required'})
    }
    try {
        const index = req.body.index-1; //fix index to be zero based now
        console.log(req.params.code);

        const result = await State.updateOne(
            {stateCode: stateCode}, 
            {$set: { [`funfacts.${index}`]: req.body.funfact} , returnNewDocument: true} 
        );
            
        res.status(201).json(result);
    } catch(err) {
        console.error(err);
    }
}

const deleteFunFact = async (req, res) => {
    //check if statecode is valid
    //verifyStates(req, res); //res gets changed here to be used below
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = stateCodes.find(element => element == stateCode);
    if(isState == null) {
        return res.status(204).json({ message: "get state: No state found." });
    }
    
    if(!req?.body?.index) { //index here cannot be zero-based or it may fail this check by being at index zero
        return res.status(400).json({ 'message': 'index required'})
    }
    try {
        const index = req.body.index-1; //fix index to be zero based now
        console.log(index);
        
        const result0 = await State.updateOne(
            {stateCode: stateCode}, 
            {$pullAll: {funfacts: req.params.deleteUid}} 
        );        
        const result = await State.updateOne(
            {stateCode: stateCode}, 
            {$pullAll: {funfacts: [index]}} 
        );    
        //var del = await State.updateOne({stateCode: stateCode}, {$unset : {[`funfacts.${index}`]: 1}});
        //del = await State.updateOne({stateCode: stateCode}, {$pull : {"funfacts": null}});
        console.log(result);

        res.status(201).json(result);
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    getAllStates,
    getState,
    getFunFact,
    getCapital,
    postFunFacts,
    patchFunFacts,
    deleteFunFact
}
