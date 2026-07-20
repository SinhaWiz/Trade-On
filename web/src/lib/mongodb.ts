import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in environment variables. Value:', uri);
} else {
  console.log('MongoDB URI found, connecting to Atlas...');
}

const options = {};

let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoUri: string | undefined;
}

function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('Please add your MONGODB_URI to .env.local');
  }
  
  console.log('Creating new MongoDB connection...');
  const client = new MongoClient(uri, options);
  return client.connect();
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // Reset if URI changed
  if (!global._mongoClientPromise || global._mongoUri !== uri) {
    global._mongoUri = uri;
    global._mongoClientPromise = getMongoClient();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = getMongoClient();
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || 'trade_on');
}
