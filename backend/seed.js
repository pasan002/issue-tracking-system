// Must be required before mongoose to fix DNS resolution on restricted networks
require('./config/dns-fix');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Issue = require('./models/Issue');
const Activity = require('./models/Activity');
const Comment = require('./models/Comment');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/issue-tracker');
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Issue.deleteMany({});
    await Activity.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing database collections.');

    // 1. Create Default Users
    const admin = await User.create({
      username: 'admin_pasan',
      email: 'admin@apextrack.com',
      password: 'password123',
      role: 'Admin',
    });

    const dev = await User.create({
      username: 'dev_developer',
      email: 'dev@apextrack.com',
      password: 'password123',
      role: 'Developer',
    });

    const tester = await User.create({
      username: 'tester_qa',
      email: 'tester@apextrack.com',
      password: 'password123',
      role: 'Tester',
    });

    console.log('Seeded 3 users (Admin, Developer, Tester).');

    // 2. Create Sample Issues
    const issue1 = await Issue.create({
      title: 'Fix state sync on kanban board column re-render',
      description: 'When updating status by selector inside issue detailed modal, the kanban board columns do not update their list states immediately unless manually reloaded.',
      type: 'Bug',
      priority: 'High',
      status: 'In Progress',
      assignee: dev._id,
      creator: admin._id,
      dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    });

    const issue2 = await Issue.create({
      title: 'Write project README guidelines',
      description: 'Detail architectural structure, backend environment configs, and frontend launch steps for the project reviewer.',
      type: 'Task',
      priority: 'Medium',
      status: 'Resolved',
      assignee: dev._id,
      creator: admin._id,
      dueDate: new Date(Date.now() - 86400000), // Due yesterday
    });

    const issue3 = await Issue.create({
      title: 'Configure JWT session expiration rules',
      description: 'Set token lifespan to 30 days and implement auto logout when token expires on front-end.',
      type: 'Task',
      priority: 'Low',
      status: 'Open',
      assignee: null,
      creator: dev._id,
      dueDate: new Date(Date.now() + 86400000 * 10), // 10 days from now
    });

    console.log('Seeded 3 sample issues.');

    // 3. Create Sample Activities & Comments
    await Activity.create({
      issue: issue1._id,
      user: admin._id,
      action: 'Issue created by admin_pasan',
    });

    await Activity.create({
      issue: issue1._id,
      user: admin._id,
      action: "Status changed from 'Open' to 'In Progress' by admin_pasan",
    });

    await Activity.create({
      issue: issue1._id,
      user: admin._id,
      action: `Assigned to dev_developer by admin_pasan`,
    });

    await Comment.create({
      issue: issue1._id,
      user: dev._id,
      text: 'I have identified that we need to trigger a context state update on status edits.',
    });

    await Activity.create({
      issue: issue1._id,
      user: dev._id,
      action: 'Added a comment: "I have identified that we need..."',
    });

    await Activity.create({
      issue: issue2._id,
      user: admin._id,
      action: 'Issue created by admin_pasan',
    });

    await Activity.create({
      issue: issue2._id,
      user: dev._id,
      action: "Status changed from 'Open' to 'Resolved' by dev_developer",
    });

    await Activity.create({
      issue: issue3._id,
      user: dev._id,
      action: 'Issue created by dev_developer',
    });

    console.log('Seeded sample comments and activities log history.');
    console.log('Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
