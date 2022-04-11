#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsEksPocStack } from '../lib/aws-eks-poc-stack';

const app = new cdk.App();
new AwsEksPocStack(app, 'AwsEksPocStack');
