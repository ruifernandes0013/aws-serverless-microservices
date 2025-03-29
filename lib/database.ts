import * as cdk from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ITable,
  Table
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

interface Tables {
  productTable: ITable;
  basketTable: ITable;
  orderTable: ITable;
}

export class SwnDatabase extends Construct {

  // product table 
  private readonly productTableName = 'product';
  public readonly productTable: ITable;
  
  // basket table 
  private readonly basketTableName = 'basket';
  public readonly basketTable: ITable;

  // order table 
  private readonly orderTableName = 'order';
  public readonly orderTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    ({ 
      productTable: this.productTable,
      basketTable: this.basketTable,
      orderTable: this.orderTable
    } = this.createTables());
  }

  private createTables(): Tables {
    return {
      productTable: this.createProductTable(),
      basketTable: this.createBasketTable(),
      orderTable: this.createOrderTable()
    };
  }

  private createProductTable(): ITable {
    return new Table(this, this.productTableName, {
      tableName: this.productTableName,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 10,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }

  private createBasketTable(): ITable {
    return new Table(this, this.basketTableName, {
      tableName: this.basketTableName,
      partitionKey: {
        name: "username",
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 10,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }

  private createOrderTable(): ITable {
    return new Table(this, this.orderTableName, {
      tableName: this.orderTableName,
      partitionKey: {
        name: "username",
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'orderDate',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 10,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}
