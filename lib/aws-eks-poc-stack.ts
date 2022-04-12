import { Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as cdk8s from 'cdk8s';
import { NodeChart } from './node-chart'

export class AwsEksPocStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "eks-vpc", {
      vpcId: "vpc-c545faa3",
    });

    const masterRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal()
    });

    const cluster = new eks.Cluster(this, "Cluster", {
      vpc: vpc,
      version: eks.KubernetesVersion.V1_21,
      // defaultCapacity: 1,
      mastersRole: masterRole,
      albController: {
        version: eks.AlbControllerVersion.V2_3_1,
      },
      outputClusterName: true,
      // Networking related settings listed below - important in enterprise context.
      endpointAccess: eks.EndpointAccess.PUBLIC, // In Enterprise context, you may want to set it to PRIVATE.

    });

    // // Grant FAO AWS Admin role permissions to the cluster.
    // const groups = [
    //   'system:masters',
    //   'system:bootstrappers',
    //   'system:nodes'
    // ]
    // const awsAuth = new eks.AwsAuth(this, 'MyAwsAuth', {
    //   cluster: cluster,
    // });
    // const user = iam.User.fromUserArn(this, 'DanieleUser', 'arn:aws:iam::086325227357:user/daniele.salvatore');
    // awsAuth.addUserMapping(user, {
    //   username: 'daniele.salvatore',
    //   groups,
    // });
    // const roleMaster = iam.Role.fromRoleArn(this, 'MasterRole', 'arn:aws:iam::368521843268:role/AwsEksPocStack-AdminRole38563C57-K3IE2LGJEJPH');
    // awsAuth.addRoleMapping(roleMaster, {
    //   groups: [
    //     'system:masters'
    //   ]
    // });
    // const assumedMaster = iam.Role.fromRoleArn(this, 'AssumedRole', 'arn:aws:sts::368521843268:assumed-role/AWSReservedSSO_AdministratorAccess_ff3addabcc448756/Daniele.Salvatore@fao.org');
    // awsAuth.addRoleMapping(assumedMaster, {
    //   groups
    // });

    // Create the cdk8s app.
    const cdk8sApp = new cdk8s.App();

    // Create the node chart
    const nodeChart = new NodeChart(cdk8sApp, 'Nodechart')

    cluster.addCdk8sChart("node-chart", nodeChart);
  }
}
