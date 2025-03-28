import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

interface SwnMicroserviceProps {
  productTable: ITable;
}

interface Microservices {
  productFunction: NodejsFunction;
}

export class SwnMicroservice extends Construct {
  public readonly productFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: SwnMicroserviceProps) {
    super(scope, id);

    ({ productFunction: this.productFunction } =
      this.createMicroservices(props));
  }

  createMicroservices(props: SwnMicroserviceProps): Microservices {
    const { productTable } = props;

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"]
      },
      environment: {
        PRIMARY_KEY: "id",
        DYNAMODB_TABLE_NAME: productTable.tableName
      },
      runtime: Runtime.NODEJS_22_X
    };

    const productFunction = new NodejsFunction(this, "productLambdaFunction", {
      entry: path.join(__dirname, "/../src/product/index.js"),
      ...nodeJsFunctionProps
    });

    productTable.grantReadWriteData(productFunction);

    return {
      productFunction
    };
  }
}
