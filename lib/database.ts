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
}

export class SwnDatabase extends Construct {
  public readonly productTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    ({ productTable: this.productTable } = this.createTables());
  }

  private createTables(): Tables {
    const productTable = new Table(this, "product", {
      tableName: "product",
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 10,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    return {
      productTable
    };
  }
}
