const topics = require('../topics')
const {publishMessage} = require('../publish')
const deviceService = require('../services/deviceService')
let intervalId = null


module.exports.updateDeviceInfo = async function updateDeviceInfo(client, buildingName) {
   
    intervalId = setInterval(() => {
        deviceService.updateDeviceState(client,buildingName)
        console.log("in interval")
    }, 1000)
    // write a test function
    
}

module.exports.stopEosEmitter = function stopEosEmitter() {
    if (intervalId) {
        clearInterval(intervalId);
        console.log("Stopped EOS emitter");
    }
}