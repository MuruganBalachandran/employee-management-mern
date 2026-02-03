
// region imports
import dotenv from 'dotenv';
dotenv.config(); // Load variables from .env file into process.env
// endregion

// region extract APP config safely
let env = {};
try {
  // parse env vars from .env
  env = JSON.parse(process?.env?.APP ?? '{}');
} catch (err) {
  throw new Error('Invalid APP environment variable JSON');
}


// region exports
export { env };
// endregion

