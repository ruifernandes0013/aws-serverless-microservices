import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

interface SwnMicroserviceProps {
  productTable: ITable;
  basketTable: ITable;
  orderTable: ITable;
}

interface Microservices {
  productFunction: IFunction;
  basketFunction: IFunction;
  orderFunction: IFunction
}

export class SwnMicroservice extends Construct {

  // product microservice 
  private readonly productFunctionName = 'productLambdaFunction';
  public readonly productFunction: IFunction;
  
  // basket microservice 
  private readonly basketFunctionName = 'basketLambdaFunction';
  public readonly basketFunction: IFunction;

  // order microservice 
  private readonly orderFunctionName = 'orderLambdaFunction';
  public readonly orderFunction: IFunction;

  constructor(scope: Construct, id: string, props: SwnMicroserviceProps) {
    super(scope, id);

    ({ 
      productFunction: this.productFunction,
      basketFunction: this.basketFunction,
      orderFunction: this.orderFunction
    } = this.createMicroservices(props));
  }

  private createMicroservices(props: SwnMicroserviceProps): Microservices {
    return {
        productFunction: this.createProductMicroservice(props.productTable),
        basketFunction: this.createBasketMicroservice(props.basketTable),
        orderFunction: this.createOrderMicroservice(props.orderTable)
    };
  }

  private createProductMicroservice(productTable: ITable): IFunction {
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

  private createBasketMicroservice(basketTable: ITable): IFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"]
      },
      environment: {
        PRIMARY_KEY: "username",
        SOURCE: "com.swn.basket.checkoutBasket",
        DETAIL_TYPE: 'CheckoutBasket',
        EVENT_BUS_NAME: 'SwnEventBus'
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

  private createOrderMicroservice(orderTable: ITable): IFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"]
      },
      environment: {
        PRIMARY_KEY: "username",
        SORT_KEY: "orderDate",
        DYNAMODB_TABLE_NAME: orderTable.tableName
      },
      runtime: Runtime.NODEJS_22_X
    };

    const orderFunction = new NodejsFunction(this, this.orderFunctionName, {
      entry: path.join(__dirname, "/../src/order/index.js"),
      ...nodeJsFunctionProps
    });

    orderTable.grantReadWriteData(orderFunction);

    return orderFunction
  }
}
