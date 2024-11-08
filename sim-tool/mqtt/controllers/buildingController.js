//TODO:

//Change building to buildingName
//Create default values for optional values

const { z } = require('zod');
const { publishMessage } = require('../publish');
const topics = require('../topics')
const buildingService = require("../services/buildingsService")

// Multiple listeners in the building controller
module.exports.init = async function initBuildingListeners(client) {
    console.log("in init")
    await createBuildingListener(client);
  };

const schema = z.object({
    building: z.string(),
    floors: z.number().int().optional(),
    lights: z.number().int().optional(), // add way to distribute lights per office 
    rooms: z.number().int().optional(), //  add default values to optional ones
    eos: z.number().int().optional(),
    sateraitos: z.number().int().optional(),
  });

async function createBuildingListener(client) {
    try {
        const postTopic = topics.settingsPostRequest
        const responseTopic = topics.settingsPostResponse
        // Subscribe to the topic
        await client.subscribe(postTopic);  // Add topic to config file so we dont have to change it everywhere
        console.log(`Subscribed to topic: ${postTopic}`);
    
        // Handle incoming messages
        client.on("message", (topic, message) => {
          if (topic === postTopic) {
            try {
              // Convert message buffer to string and parse as JSON
              const parsedMessage = JSON.parse(message.toString());
              console.log(`Received message on topic ${topic}:`, parsedMessage);
    
              // Validate the parsed message using Zod
              const validatedData = schema.parse(parsedMessage);
    
              // Destructure validated data
              const { building, floors, rooms, eos, lights, sateraitos } = validatedData;

              console.log(validatedData)

              if(buildingService.buildingExists(building)){
                const errorResponse = {status: 'error',message: `Building "${building}" already exists`}
                publishMessage(client, responseTopic, errorResponse, false)

                return
              }

              console.log(building)

              const newBuilding = buildingService.createNewBuilding(building,floors,rooms,eos, lights, sateraitos)

              console.log(newBuilding)

              buildingService.saveBuilding(newBuilding)

              const response = { status: 'success', message: 'Building saved successfully' };
              buildingService.publishBuildings(client)
              publishMessage(client,responseTopic,response, false)

            } catch (error) {
              // Handle errors: either parsing or validation errors
              console.error(`Building controller: Error processing message on ${topic}: ${error.message}`);
            }

          }
        });
      } catch (error) {
        // Handle errors in subscribing or setting up the listener
        console.error(`Error in createBuildingListener: ${error.message}`);
      }
  };
  