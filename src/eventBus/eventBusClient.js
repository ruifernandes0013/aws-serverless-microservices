import { EventBridgeClient } from "@aws-sdk/client-eventbridge";

class EventBusClient {
  static instance = null;

  static getInstance() {
    if (!EventBusClient.instance) {
      console.log('Initializing the event bus connection...');
      EventBusClient.instance = new EventBridgeClient;
    }
    return EventBusClient.instance;
  }
}

export const eventBusClient = EventBusClient.getInstance();