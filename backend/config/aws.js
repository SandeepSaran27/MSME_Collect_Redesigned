const { S3Client } = require('@aws-sdk/client-s3');
const { TextractClient } = require('@aws-sdk/client-textract');
const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const region = process.env.AWS_REGION || process.env.VITE_AWS_REGION || 'us-east-1';

const hasAwsCredentials = Boolean(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_ACCESS_KEY_ID !== 'mock_key'
);

let s3Client = null;
let textractClient = null;
let bedrockClient = null;
let dynamoClient = null;

if (hasAwsCredentials) {
  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };

  s3Client = new S3Client({ region, credentials });
  textractClient = new TextractClient({ region, credentials });
  bedrockClient = new BedrockRuntimeClient({ region, credentials });
  dynamoClient = new DynamoDBClient({ region, credentials });
}

/**
 * Returns real runtime AWS service configuration status.
 */
const getAwsStatus = () => {
  const mode = hasAwsCredentials ? 'AWS_CONNECTED' : 'DEMO_MODE';

  return {
    mode,
    isConfigured: hasAwsCredentials,
    region,
    services: {
      s3: {
        status: process.env.S3_BUCKET_NAME && hasAwsCredentials ? 'ACTIVE' : 'DEMO_FALLBACK',
        bucket: process.env.S3_BUCKET_NAME || 'msme-collect-documents-demo',
        description: 'Document Storage & Preservation',
      },
      textract: {
        status: hasAwsCredentials ? 'ACTIVE' : 'DEMO_FALLBACK',
        description: 'Document Intelligence & Field Extraction',
      },
      bedrock: {
        status: hasAwsCredentials ? 'ACTIVE' : 'DEMO_FALLBACK',
        modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0',
        description: 'Structured Evidence Reasoning & Follow-up Generation',
      },
      dynamoDb: {
        status: process.env.DYNAMODB_TABLE_PREFIX && hasAwsCredentials ? 'ACTIVE' : 'DEMO_FALLBACK',
        description: 'High-Scale Production NoSQL Store',
      },
      cognito: {
        status: process.env.COGNITO_USER_POOL_ID || process.env.VITE_COGNITO_USER_POOL_ID ? 'CONFIGURED' : 'DEMO_FALLBACK',
        userPoolId: process.env.COGNITO_USER_POOL_ID || process.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_DemoPool',
        description: 'Enterprise OAuth & User Management',
      },
      amplify: {
        status: 'READY',
        description: 'Frontend Cloud Hosting & Edge Delivery',
      },
    },
  };
};

module.exports = {
  s3Client,
  textractClient,
  bedrockClient,
  dynamoClient,
  hasAwsCredentials,
  getAwsStatus,
};
