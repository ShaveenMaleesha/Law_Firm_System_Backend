const mongoose = require('mongoose');
const Lawyer = require('./models/Lawyer');
require('dotenv').config();

// Migration script to convert practiceArea from string to array
async function migratePracticeArea() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find all lawyers with practiceArea as string
    const lawyers = await mongoose.connection.db.collection('lawyers').find({
      practiceArea: { $type: "string" }
    }).toArray();

    console.log(`Found ${lawyers.length} lawyers with string practiceArea`);

    if (lawyers.length === 0) {
      console.log('No migration needed. All lawyers already have array practiceArea.');
      process.exit(0);
    }

    // Update each lawyer to convert string to array
    for (const lawyer of lawyers) {
      const practiceAreaArray = [lawyer.practiceArea];
      
      await mongoose.connection.db.collection('lawyers').updateOne(
        { _id: lawyer._id },
        { $set: { practiceArea: practiceAreaArray } }
      );
      
      console.log(`Updated lawyer ${lawyer.name}: "${lawyer.practiceArea}" → [${practiceAreaArray.join(', ')}]`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  migratePracticeArea();
}

module.exports = migratePracticeArea;
