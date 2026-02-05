// Script to drop old Email index from Employee collection
// Run this once to fix the duplicate key error

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropEmailIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the Employee collection
    const db = mongoose.connection.db;
    const collection = db.collection('employees');

    // List all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Drop the Email_1 index
    try {
      await collection.dropIndex('Email_1');
      console.log('✅ Successfully dropped Email_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  Email_1 index does not exist (already dropped)');
      } else {
        throw err;
      }
    }

    // List indexes after dropping
    const indexesAfter = await collection.indexes();
    console.log('Indexes after drop:', indexesAfter);

    console.log('✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

dropEmailIndex();
