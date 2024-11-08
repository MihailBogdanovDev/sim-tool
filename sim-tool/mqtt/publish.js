module.exports.publishMessage = async function publishMessage(client, topic, jsonMessage, retained) {
    try {
     // console.log("in publish")
      const message = JSON.stringify(jsonMessage);
     // console.log("red message")
      await client.publish(topic, message, {retain: retained});
     // console.log(`Published message to ${topic}:`, message);
    } catch (error) {
      console.error(`Error publishing message to ${topic}: ${error.message}`);
    }
  }

  module.exports.publishRawMessage = async function publishRawMessage(client, topic, message, retained) {
    try {
     // console.log("IN RAW PUBLISH")
      // Convert message to a string if it isn't one already (handle float, int, etc.)
      const formattedMessage = typeof message === 'string' ? message : message.toString();
      await client.publish(topic, formattedMessage, {retain: retained});
      //console.log(`Published RAW message to ${topic}:`, message);
    } catch (error) {
      console.error(`Error publishing RAW message to ${topic}: ${error.message}`);
    }
  }