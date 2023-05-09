//Checks if the state code is a real statecode
//returns uppercase, verified statecode as res

//make an array so find function works
const data = {
    states: require('../model/statesData.json')
}

const verifyCode = () => { //needed this so next() worked
    return (req, res, next) => {
        if (!req?.code) {
            return res.sendStatus(401);
        }
        const stateCode = data.find(item => item.key === "code");
        res.code = req.code.map(code => stateCode.includes(code)).find(val => val === true);
        next();
    }
}

module.exports = verifyCode
