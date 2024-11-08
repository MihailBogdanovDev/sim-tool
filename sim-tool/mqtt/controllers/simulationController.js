const { z } = require('zod');
const {generateTopics, generateSateraitoTopics} = require('../createTopics')
const {startSimulation, stopSimulation} = require('../services/simulationService')
const buildingService = require('../services/buildingsService')
const topics = require('../topics');

let simTime = null

// Multiple listeners in the building controller
module.exports.init = async function initSimulationListeners(client) {
    await createSimulationListener(client);
    await stopSimulationListener(client)
  };


const schema = z.object({
    buildingName: z.string(),
    time: z.number().int(),
  });

async function createSimulationListener(client) {

    const startSimTopic = topics.startSimulation

     // Subscribe to the topic
     await client.subscribe(startSimTopic);  // Add topic to config file so we dont have to change it everywhere
     console.log(`Subscribed to topic: ${startSimTopic}`);

     client.on("message", async (topic, message) => {
        if(topic === startSimTopic){
            console.log("in topic aaaa")
            try{
                console.log("in try")
                const parsedMessage = JSON.parse(message.toString())
                console.log(parsedMessage)

                const validatedData = schema.parse(parsedMessage)

                console.log(validatedData)

                const {buildingName, time} = validatedData

                simTime = time

                const building = buildingService.getBuildingByName(buildingName)

                console.log(building)

                if(building){
                    console.log("in if")
                    const topics = await generateTopics(building) //Fix function to work with building Object
                    //const sateraitoTopics = await generateSateraitoTopics(building)
                    startSimulation(client, topics, time)
                }   
            }
            catch(err){
              // Handle errors: either parsing or validation errors
              console.error(`Sim Controller: Error processing message on ${topic}: ${err.message}`);
            }
        }
        else{
            
        }
     })
}

async function stopSimulationListener(client) {

    const stopSimTopic = topics.stopSimulation
    await client.subscribe(stopSimTopic);

    client.on("message", async (topic, message) => {
        if(topic===stopSimTopic){
            stopSimulation(client)
        }
        
    })

}
