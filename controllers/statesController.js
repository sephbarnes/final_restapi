const { query } = require("express");
var ObjectId = require('bson').ObjectId;
const State= require("../model/State");
const data = { //need this to use filterconst 
 

  states: require('../model/statesData.json')
}

const getAllStates = async (req, res) => {
    const mongoState = await State.find().exec(); //get all states
    if(!mongoState) {
      return res.json({"message": "no state found in mongo"});
    }
    //console.log(req.query.contig);
  
  
    if (req.query.contig == "true") {
        //get state data for 48, excluding AK & HI
        let contigStates = data.states.filter(state => state.code !== 'AK' && state.code !== 'HI');
         
        return res.json(contigStates);
    } else if (req.query.contig == "false") {
        //get state data for AK and HI only
        let nonContigStates = data.states.filter(state => state.code == 'AK' || state.code == 'HI');
        
        return res.json(nonContigStates);
    } else {
      let allStates = data.states;
        for (let i = 0; i < allStates.length; i++) {
          for (let j = 0; j < 5; j++) {
            if (allStates[i]['code'] == mongoState[j]['stateCode']) {
              allStates[i].funfacts = mongoState[j].funfacts;    
            }
          }
        }            
        return res.json(allStates);
    }

}

const getState = async (req, res) => {
  if (!req?.params?.code) return res.status(400).json({'message': "not today!"});
  
  var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = data.states.filter(req => req.code).map(element => element.code); //map of all statecodes
    //console.log(stateCodes);
    
    //check if state is in the statesData
    let isState = 0;
    isState = stateCodes.find(element => element == stateCode);

    if(isState == null) {
       return res.json({ message: "Invalid state abbreviation parameter" });
    }

    //get state to respond with
    var stateRes = data.states.find(function(element) { 
        return element.code == stateCode;
    });  
    
    const mongoState = await State.findOne({ stateCode: req.params.code.toUpperCase()}).exec();
    if(mongoState) {//if in mongo add funfacts
      stateRes.funfacts = mongoState.funfacts;
    }               

  //console.log(stateRes);

    if (!stateRes) return res.json({ message: "Invalid state abbreviation parameter" });
    res.json(stateRes);
} 

const getFunFact = async (req, res) => {
//verifyStates(req, res); //res gets changed here to be used below
    
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = data.states.filter(req => req.code).map(element => element.code); //map of all statecodes
    //console.log(stateCodes);
    
    //check if state is in the statesData
    let isState = 0;
    isState = stateCodes.find(element => element == stateCode);

    if(isState == null) {
       return res.json({ message: "Invalid state abbreviation parameter" });
    }
      //get state to respond with
    var stateRes = data.states.find(function(element) { 
        return element.code == stateCode;
    });  

    const mongoState = await State.findOne({ stateCode: req.params.code.toUpperCase()}).exec(); //holds the requested state
    if(!mongoState) {
       return res.json({ 'message': `No Fun Facts found for ${stateRes.state}`});
    }
  
  //deliver a funfact ramdomly
    const numFacts = mongoState.funfacts.length; //get number of facts in the state
    const randomNum = Math.floor(Math.random() * numFacts);
    return res.json({"funfact":mongoState.funfacts[randomNum]})  
}

const getCapital = async (req, res) => {
    //check if statecode is valid
    //verifyStates(req, res); //res gets changed here to be used below
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = data.states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = stateCodes.find(element => element == stateCode);
    if(isState == null) {
        return res.json({ message: "Invalid state abbreviation parameter" });
    }

    const stateRes = data.states.find(function(element) { //stateRes becomes the state
        return element.code == stateCode;
    }); 
    if (!stateRes) return res.json({ message: "Invalid state abbreviation parameter" });
    //access state capital

    const capital = stateRes.capital_city;
    const stateName = stateRes.state;
    res.json({'state':stateName,'capital':capital});
}

const getNickname = async (req, res) => {
    //check if statecode is valid
    //verifyStates(req, res); //res gets changed here to be used below
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = data.states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = stateCodes.find(element => element == stateCode);
    if(isState == null) {
        return res.json({ message: "Invalid state abbreviation parameter" });
    }

    const stateRes = data.states.find(function(element) { //stateRes becomes the state
        return element.code == stateCode;
    }); 
    //console.log(stateRes);  
    if (!stateRes) return res.json({ message: "Invalid state abbreviation parameter" });
    //access state nickname

    const nickname = stateRes.nickname;
    const stateName = stateRes.state;
    res.json({'state':stateName,'nickname':nickname});
}

const getPopulation = async (req, res) => {
    //check if statecode is valid
    //verifyStates(req, res); //res gets changed here to be used below
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = data.states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = stateCodes.find(element => element == stateCode);
    if(isState == null) {
        return res.json({ message: "Invalid state abbreviation parameter" });
    }

    const stateRes = data.states.find(function(element) { //stateRes becomes the state
        return element.code == stateCode;
    }); 
    //console.log(stateRes);  
    if (!stateRes) return res.json({ message: "Invalid state abbreviation parameter" });
    //access state population

    var population = stateRes.population.toLocaleString("en-US");
    const stateName = stateRes.state;
    res.json({'state':stateName,'population':population});
}

const getAdmission = async (req, res) => {
    //check if statecode is valid
    //verifyStates(req, res); //res gets changed here to be used below
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = data.states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = stateCodes.find(element => element == stateCode);
    if(isState == null) {
        return res.json({ message: "Invalid state abbreviation parameter" });
    }

    const stateRes = data.states.find(function(element) { //stateRes becomes the state
        return element.code == stateCode;
    }); 
    //console.log(stateRes);  
    if (!stateRes) return res.json({ message: "Invalid state abbreviation parameter" });
    //access state admission

    const admission = stateRes.admission_date;
    const stateName = stateRes.state;
    console.log(admission);
    res.json({'state':stateName,'admitted':admission});
}

const postFunFacts = async (req, res) => {
    if (!req?.body?.funfacts) {
        return res.json({ message:  'State fun facts value required'});
    }
    //check if statecode is valid
    //verifyStates(req, res); //res gets changed here to be used below
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = data.states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = stateCodes.find(element => element == stateCode);
    if(isState == null) {
        return res.json({ message: "Invalid state abbreviation parameter" });
    }

    const stateRes = data.states.find(function(element) { //stateRes becomes the state
        return element.code == stateCode;
    }); 
      
    if (!stateRes) return res.json({ message: "Invalid state abbreviation parameter" });
    
  //we now know the statecode is valid and want to pull funfacts to insert into mongoDB
    try {
      console.log(req.body.funfacts);
      if(!Array.isArray(req.body.funfacts)) {
        return res.json({ message: 'State fun facts value must be an array'});
      }
       const result = await State.updateOne(
          {stateCode: req.params.code.toUpperCase()},
          {$push: {funfacts: req.body.funfacts}},  //add to the array
      );
      //see if result says not a state and then create state to insert
    var fact = JSON.stringify(req.body);
      if(result.matchedCount == 0) { //there was no state found
        var id = new ObjectId();
        console.log(typeof fact);
        var state1 = new State({_id: id.toString(), stateCode: req.params.code.toUpperCase(), funfacts: fact});
        const result1 = await state1.save();
        res.json(result1);
      }
    if(result.modifiedCount == 0) {
      res.json({ message: "probably tried to post a duplicate funfact element/string"});
    }
      
      res.json(result);
    } catch (err) {
        console.error(err);
    }
}

const patchFunFacts = async (req, res) => {
    if (!req?.body?.index) { //index here cannot be zero-based or it may fail this check by being at index zero
        return res.json({ 'message': 'State fun fact index value required'})
    }
    if (!req?.body?.funfacts) {
        return res.json({ message:  'State fun fact value required'});
    }

    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = data.states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
    //check if state is in the statesData
    let isState = stateCodes.find(element => element == stateCode);
    if(isState == null) {
        return res.json({ message: "get state: No state found." });
    }
    //get state to respond with
    var stateRes = data.states.find(function(element) { 
        return element.code == stateCode;
    });
        

    const mongoState = await State.findOne({ stateCode: req.params.code.toUpperCase()}).exec(); //holds the requested state
    if(!mongoState) {
       return res.json({ 'message': `No Fun Facts found for ${stateRes.state}`});
    }
    try {
        const index = req.body.index-1; //fix index to be zero based now
        console.log(req.params.code);

        const result = await State.updateOne(
            {stateCode: stateCode}, 
            {$set: { [`funfacts.${index}`]: req.body.funfacts} , returnNewDocument: true} 
        );
            
        res.json(result);
    } catch(err) {
        console.error(err);
    }
}

const deleteFunFact = async (req, res) => {
    //check if statecode is valid
    //verifyStates(req, res); //res gets changed here to be used below
    var st = req.params.code; //get the uri statecode 
    const stateCode = st.toUpperCase();  //turn the requested statecode to uppercase
    const stateCodes = data.states.filter(req => req.code).map(element => element.code); //map of all statecodes
    
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
    getNickname,
    getPopulation,
    getAdmission,
    postFunFacts,
    patchFunFacts,
    deleteFunFact
}
