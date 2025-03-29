/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SwnDatabase } from "./database";
import { SwnMicroservice } from "./microservice";
import { SwnApiGateway } from "./apigateway";
import { SwnEventBus } from "./eventbus";

export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { 
      productTable, 
      basketTable 
    } = new SwnDatabase(this, "Database");

    const { 
      productFunction, 
      basketFunction
    } = new SwnMicroservice(this, "Microservices", {
      productTable, basketTable
    }); 

    new SwnApiGateway(this, 'ApiGateways', {
      productFunction,
      basketFunction
    }) 

    new SwnEventBus(this, 'EventBuses', {
      checkoutBus: {
        publisherFunction: basketFunction,
        targetFunction: (() => {}) as any
      }
    })
  }
}
