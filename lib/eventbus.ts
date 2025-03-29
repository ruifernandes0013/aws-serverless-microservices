import { EventBus, IEventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface EventBuses {
  checkoutEventBus: IEventBus;
}

interface SwnEventBusProps {
  checkoutBus: CreateCheckoutBusProps
}

interface CreateCheckoutBusProps {
  publisherFunction: IFunction, 
  targetFunction: IFunction
}

export class SwnEventBus extends Construct {

  // checkout basket event bus 
  private readonly eventBusName = 'SwnEventBus'
  private readonly checkoutBasketRuleName = 'CheckoutBasketRule'
  public readonly checkoutEventBus: IEventBus

  
  constructor(scope: Construct, id: string, props: SwnEventBusProps) {
    super(scope, id);

    ({
      checkoutEventBus: this.checkoutEventBus 
    } = this.createEventBuses(props));
  }

  private createEventBuses(props: SwnEventBusProps): EventBuses {
    return {
      checkoutEventBus: this.createCheckoutBus({
        publisherFunction: props.checkoutBus.publisherFunction,
        targetFunction: props.checkoutBus.targetFunction
      })
    };
  }

  private createCheckoutBus(props: CreateCheckoutBusProps): IEventBus {
    const { publisherFunction, targetFunction } = props
    const deadLetterQueue = new Queue(this, 'DLQ');

    const eventBus = new EventBus(this, this.eventBusName, {
      eventBusName: this.eventBusName,
      deadLetterQueue     
    })

    const checkoutRule = new Rule(this, this.checkoutBasketRuleName, {
      enabled: true,
      description: 'When Basket Microservice checkouts the basket',
      eventPattern: {
        source: ["com.swn.basket.checkoutBasket"],
        detailType: ['CheckoutBasket']
      },
      eventBus,
      ruleName: this.checkoutBasketRuleName
    });
    // const checkoutQueue = new Queue(this, 'CheckoutQueue')
    // checkoutRule.addTarget(new SqsQueue(checkoutQueue));

    checkoutRule.addTarget(new LambdaFunction(targetFunction));
    eventBus.grantPutEventsTo(publisherFunction)

    return eventBus
  }
}
