const { publishMessage, publishRawMessage } = require('../publish'); // Import the publishMessage function
const fs = require('fs');
const path = require('path');
const topics = require('../topics')
const {Building} = require('../../dist/building')
const {DeviceType, DeviceStatuses} = require('../../models/devicesEnum')
const {getBuildingByName,updateBuilding} = require('./buildingsService');
const { updateDeviceInfo } = require('../emitters/eosEmitter');


module.exports.setDefaultDeviceState = async function setDefaultDeviceState(client, topic) {
    const devicePath = parseDeviceIdFromTopic(topic);

    // Retrieve the Eos device object based on the devicePath
    const eosDevice = getDeviceByDevicePath(devicePath);

    if (!eosDevice) {
        console.error("Eos device not found.");
        return;
    }

    if (devicePath.sensorType) {
        console.log("IN SENSOR");

        // Loop through the sensors in the eosDevice and find the relevant sensor type
        const sensor = eosDevice.sensors.find(s => s.name.toLowerCase().includes(devicePath.sensorType));

        if (sensor) {
            console.log(`IN ${sensor.name.toUpperCase()} SENSOR`);
            publishRawMessage(client, topic, sensor.state, false); // Publish sensor value dynamically
        } else {
            console.error(`Sensor ${devicePath.sensorType} not found in Eos device.`);
        }
    }
}


module.exports.updateDeviceState = async function updateDeviceState(client, buildingName) {
    const building = getBuildingByName(buildingName);
    if (!building) {
        console.error(`Building ${buildingName} not found.`);
        return;
    }

    const currentTime = Date.now(); // Get the current timestamp

    // Iterate over each floor in the building
    building.floors.forEach((floor, floorIndex) => {
        const floorStr = String(floorIndex).padStart(2, '0'); // Pad floor index

        // Iterate over each room in the floor
        floor.forEach((room) => {
            room.eosDevices.forEach((eos) => {
                // Update uptime
                const uptimeSensor = eos.sensors.find(sensor => sensor.name === 'uptime');
                let lastUpdateTime = eos.lastUpdateTime || currentTime;

                if (uptimeSensor) {
                    const deltaSeconds = Math.floor((currentTime - lastUpdateTime) / 1000);

                    if (deltaSeconds >= 1) { // Ensure at least 1 second has passed
                        uptimeSensor.state += deltaSeconds; // Update uptime
                        eos.lastUpdateTime = currentTime; // Update lastUpdateTime

                        const uptimeTopic = `${building.name}/${floorStr}/office/${room.name}/eos/${eos.name}/sensor/uptime/state`;
                        publishRawMessage(client, uptimeTopic, uptimeSensor.state, true);
                       // console.log(`Published uptime state to ${uptimeTopic}: ${uptimeSensor.state}`);
                    }
                }

                // Update other sensors (temperature, humidity, light)
                eos.sensors.forEach(sensor => {
                    if (sensor.name.includes("temperature")) {
                        sensor.state = room.temperature;
                    } else if (sensor.name.includes("humidity")) {
                        sensor.state = room.humidity;
                    } else if (sensor.name.includes("light")) {
                        sensor.state = room.light;
                    }

                    if(sensor.name === "pir"){
                        const sensorTopic = `${building.name}/${floorStr}/office/${room.name}/eos/${eos.name}/binary_sensor/${sensor.name}/state`;
                        publishRawMessage(client, sensorTopic, sensor.state, false);
                    }
                    else if (sensor.name !== "uptime") { // Publish other sensor states
                        const sensorTopic = `${building.name}/${floorStr}/office/${room.name}/eos/${eos.name}/sensor/${sensor.name}/state`;
                        publishRawMessage(client, sensorTopic, sensor.state, false);
                     //   console.log(`Published ${sensor.name} state to ${sensorTopic}: ${sensor.state}`);
                    }
                });
                
                publishRawMessage(client, `${building.name}/${floorStr}/office/${room.name}/eos/${eos.name}/switch/restart/state`, eos.restartSwitch.state, false);
            });
        });
    });

    updateBuilding(building); // Save the updated building state
};


module.exports.publishSateraitoInfo = function publishSateraitoInfo(client, buildingName, sateraitoTopics){
    const building = getBuildingByName(buildingName);
    if (!building) {
        console.error(`Building ${buildingName} not found.`);
        return;
    }

    building.sateraitos.forEach((sateraito, sateraitoIndex) => {
        const sateraitoStr = String(sateraitoIndex).padStart(2, '0'); 

        //TODO USE TOPICS MODULE
        // Get the first digit of the sateraito device id
        const floorStr = String(sateraito.deviceId.match(/F(\d+)N/)[1]).padStart(2, '0');

            const sateraitoTopic = `${building.name}/sateraito/${floorStr}/${sateraito.name}/bridge/state`;
            publishRawMessage(client, sateraitoTopic, sateraito.state, false);
            console.log(`Published sateraito state to ${sateraitoTopic}: ${sateraito.name}`);

            const deviceSubTopic = `${building.name}/sateraito/${floorStr}/${sateraito.name}/bridge/devices`;  

            publishMessage(client, deviceSubTopic, sateraito.devices, false);             

            const groupSubTopic = `${building.name}/sateraito/${floorStr}/${sateraito.name}/bridge/groups`;

            const sateraitoGroups = sateraito.groups.map(group => {
                return { 
                    friendlyName: group.friendlyName,
                    id: group.id,
                    members: group.members.map(member => {
                        return {
                            ieee_address: member.ieee_address,
                            endpoint: member.endpoint
                        }
                    })
                }
            }
        );


            publishMessage(client, groupSubTopic, sateraitoGroups, false);

            const officeNames = sateraito.groups.map(group => group.friendlyName);
            const groupAvailability = sateraito.groups.map(group => group.status);

            console.log("GROUP AVAILABILITY")
            console.log(groupAvailability)
            const officeSubTopic = `${building.name}/sateraito/${floorStr}/${sateraito.name}`;


            for (let i = 0; i < officeNames.length; i++) {
                const officeName = officeNames[i];
                const officeAvailability = groupAvailability[i];
                console.log("OFFICE AVAILABILITY")
                console.log(officeAvailability)
                const availabilityObj = {
                    state: officeAvailability
                }
                const officeTopic = `${officeSubTopic}/${officeName}/availability`;
                publishMessage(client, officeTopic, availabilityObj, false);
            }
    });
}

function getDeviceByDevicePath(devicePath) {
    const building = getBuildingByName(devicePath.buildingName);

    if (!building) {
        console.error(`Building ${devicePath.buildingName} not found.`);
        return null;
    }

    const floor = building.floors[devicePath.floor];
    if (!floor) {
        console.error(`Floor ${devicePath.floor} not found in building ${devicePath.buildingName}.`);
        return null;
    }

    const room = floor[devicePath.office];
    if (!room) {
        console.error(`Office ${devicePath.office} not found on floor ${devicePath.floor}.`);
        return null;
    }

    const eosDevice = room.eosDevices[devicePath.device];
    if (!eosDevice) {
        console.error(`Eos device ${devicePath.device} not found in office ${devicePath.office}.`);
        return null;
    }

    return eosDevice; // Return the Eos object
}

module.exports.publishOfficeLightsTopics = function publishOfficeLightsTopics (client, buildingName) {
    
    const building = getBuildingByName(buildingName);
    if (!building) {
        console.error(`Building ${buildingName} not found.`);
        return;
    }



    building.floors.forEach((floor, floorIndex) => {
        const floorStr = String(floorIndex).padStart(2, '0'); // Pad floor index

        floor.forEach((room) => {
            room.zigbeeGroups.forEach((group) => {
                const groupTopics = topics.generateOfficeLightsTopics(building.name, floorStr, room, group);
                const groupTopic = groupTopics[0]; //TODO: Make it work with multiple groups

                const lamp = group.members[0];
                console.log(lamp)

                
               const groupStats = {
                    brightness: lamp.brightness,
                    color_mode: lamp.color_mode,
                    color_temp: lamp.color_temp,
                    state: lamp.state
                }
                console.log(groupStats)
                publishMessage(client, groupTopic, groupStats , false);
            });
        });
    });
    
}

function parseDeviceIdFromTopic(topic){
    const parts = topic.split('/');

    const buildingName = parts[0];
    const floor = parseInt(parts[1].charAt(1), 10); // Extract the second character for floor
    const office = parseInt(parts[3].charAt(1), 10); // Extract the second character for office
    const device = parseInt(parts[5].charAt(1), 10); // Extract the second character for the eos device
    let sensorType;

    if (parts[6] && parts[6] === "sensor") {
        sensorType = parts[7]; // Get the sensor type from the topic
    }

    return { buildingName, floor, office, device, sensorType };
  }