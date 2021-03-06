import { Stack, StackProps } from 'aws-cdk-lib';
import { SubscriptionProtocol } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from './genericTable';

export class SpaceStack extends Stack {

    private api = new RestApi(this, 'SpaceAPI')
    private spaceTable = new GenericTable(
        'SpacesTable',
        'spaceId',
        this
    )

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props)
    

        const helloLambda = new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
            handler: 'hello.main'
        })

        // Hello Api lambda integration
        const helloLambdaIntegration = new LambdaIntegration(helloLambda)
        const helloLambdaResource = this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);
    }
}