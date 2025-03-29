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
  basketTable: ITable;
}

interface Microservices {
  productFunction: NodejsFunction;
  basketFunction: NodejsFunction;
}

export class SwnMicroservice extends Construct {

  // product microservice 
  private readonly productFunctionName = 'productLambdaFunction';
  public readonly productFunction: NodejsFunction;
  
  // basket microservice 
  private readonly basketFunctionName = 'basketLambdaFunction';
  public readonly basketFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: SwnMicroserviceProps) {
    super(scope, id);

    ({ 
      productFunction: this.productFunction,
      basketFunction: this.basketFunction
    } = this.createMicroservices(props));
  }

  private createMicroservices(props: SwnMicroserviceProps): Microservices {
    return {
        productFunction: this.createProductMicroservice(props.productTable),
        basketFunction: this.createBasketMicroservice(props.basketTable)
    };
}

  private createProductMicroservice(productTable: ITable): NodejsFunction {
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

    const productFunction = new NodejsFunction(this, this.productFunctionName, {
      entry: path.join(__dirname, "/../src/product/index.js"),
      ...nodeJsFunctionProps
    });

    productTable.grantReadWriteData(productFunction);

    return productFunction
  }

  private createBasketMicroservice(basketTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"]
      },
      environment: {
        PRIMARY_KEY: "username",
        DYNAMODB_TABLE_NAME: basketTable.tableName
      },
      runtime: Runtime.NODEJS_22_X
    };

    const basketFunction = new NodejsFunction(this, this.basketFunctionName, {
      entry: path.join(__dirname, "/../src/basket/index.js"),
      ...nodeJsFunctionProps
    });

    basketTable.grantReadWriteData(basketFunction);

    return basketFunction
  }
}
