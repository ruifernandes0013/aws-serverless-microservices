import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SwnDatabase } from "./database";
import { SwnMicroservice } from "./microservice";
import { SwnApiGateway } from "./apigateway";

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
  }
}
