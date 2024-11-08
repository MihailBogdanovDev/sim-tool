const { off } = require('process');
const { DeviceType, DeviceStatuses } = require('../../models/devicesEnum');
const { publishMessage } = require('../publish')
const deviceService = require('./deviceService')
const topics = require("../topics")
const {getBuildingByName} = require('./buildingsService')
const {updateDeviceInfo, updateUptime, stopEosEmitter} = require('../emitters/eosEmitter')
const {stopBuildingsEmitter} = require('../emitters/buildingsEmitter')

let simulationActive = false; // Track whether the simulation is running
let intervalId = null;
let runtime = null

// Function to randomly select a status based on the device type
function getRandomStatus(deviceType) {
    const statuses = DeviceStatuses[deviceType];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  }

async function startRandomStatusUpdates(client, topics) { //recreate that it cycles through all statuses one by one

    intervalId = setInterval(() => {
        if(!simulationActive){
            clearInterval(intervalId);
            return;
        }

        topics.forEach(topic => {
            const deviceType = parseDeviceTypeFromTopic(topic)

            if(deviceType && DeviceStatuses[deviceType]){
                const randomStatus = getRandomStatus(deviceType)
                const message = {status: randomStatus}
                publishMessage(client, topic, message, false)
                console.log(`Published ${randomStatus} to ${topic}`)
            }
        })
    }, 5000) //5 seconds interval
}

const statusTopic = topics.simulationStatus;

module.exports.startSimulation = async function startSimulation(client, topics, time) {

    if (!Array.isArray(topics)) {
        console.error('Error: topics must be an array');
        return; // Exit the function if topics is not an array
    }

    // Extract the building name from the first topic
    const firstTopic = topics[0]; // Get the first topic in the array
    const buildingName = firstTopic.split('/')[0]; // Split the topic by '/' and take the first segment
    console.log(`Building Name: ${buildingName}`);

    const building = getBuildingByName(buildingName); // use this to get stats of eos

   publishMessage(client, statusTopic, "online", true)
    simulationActive = true;
     // Iterate over each pair of topics (status + sensor)
     topics.forEach((topic, index) => {
        console.log("Publishing to topic:", topic);

        // Publish the "status" topic
        const statusMessage = "online"; // TODO: Decide how to determine default status message for each topic. (Idea: get default values from device)
        publishMessage(client, topic, statusMessage, false);

        //publish state
        
        deviceService.setDefaultDeviceState(client,topic)   
    });    

    deviceService.publishSateraitoInfo(client,buildingName)
    deviceService.publishOfficeLightsTopics(client,buildingName)

    updateDeviceInfo(client,buildingName)
   

    runtime = time

        // Schedule stopSimulation after runtime has passed
        setTimeout(() => {
            module.exports.stopSimulation(client);
        }, runtime * 1000); // Convert runtime to milliseconds
    //startRandomStatusUpdates(client,topics)
}

module.exports.stopSimulation = async function stopSimulation(client) {
    console.log("in stop sim")
    stopEosEmitter();
    stopBuildingsEmitter();
    publishMessage(client, statusTopic, "offline", true)
    simulationActive = false;
}

function parseDeviceTypeFromTopic(topic) {
    // Split the topic string into parts using '/' as a delimiter
    const parts = topic.split('/');
    
    // Check if the topic includes specific device type keywords (e.g., eos, lighting, hvac)
    return parts.includes(DeviceType.EOS) ? DeviceType.EOS
         : null; // Return null if no matching device type is found
  }

