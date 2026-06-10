const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const bcrypt = require('bcryptjs');

// Use the environment variable if available (e.g., inside Docker), otherwise fallback to the host exposed port
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/felicity';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    const clubs = [
      { name: 'Programming Club', category: 'Tech Club' },
      { name: 'Cultural Council', category: 'Cultural Club' },
      { name: 'Sports Council', category: 'Sports Council' },
      { name: 'Debate Society', category: 'Cultural Club' },
      { name: 'Dance Club', category: 'Cultural Club' },
      { name: 'Photography Club', category: 'Tech Club' },
      { name: 'Robotics Club', category: 'Tech Club' },
      { name: 'Music Society', category: 'Cultural Club' },
      { name: 'Gaming Club', category: 'Tech Club' },
      { name: 'Literature Club', category: 'Cultural Club' },
      { name: 'Art Society', category: 'Cultural Club' },
      { name: 'E-Cell', category: 'Tech Club' }
    ];

    const savedClubs = [];
    for (const club of clubs) {
      const org = new User({
        name: club.name,
        email: `${club.name.toLowerCase().replace(/\s+/g, '')}@iiit.ac.in`,
        password: 'password123',
        role: 'organizer',
        category: club.category,
        description: `Official ${club.name} of IIITH.`,
        onboardingComplete: true,
        clubLogoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${club.name}`
      });
      savedClubs.push(await org.save());
    }
    console.log(`Created ${savedClubs.length} Organizers (Clubs)`);

    // Generate 50 Participants
    const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Rohan', 'Neha', 'Vikas', 'Pooja', 'Karan', 'Aditi', 'Raj', 'Anjali', 'Sameer', 'Kavya', 'Tarun'];
    const lastNames = ['Sharma', 'Verma', 'Singh', 'Gupta', 'Patel', 'Kumar', 'Jain', 'Shah', 'Reddy', 'Das', 'Roy'];
    const savedParticipants = [];

    for (let i = 0; i < 50; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const type = Math.random() > 0.5 ? 'iiit' : 'non-iiit';
      const email = type === 'iiit' ? `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@students.iiit.ac.in` : `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@gmail.com`;
      
      const p = new User({
        firstName: fn,
        lastName: ln,
        email,
        password: 'password123',
        role: 'participant',
        participantType: type,
        collegeOrOrg: type === 'iiit' ? 'IIIT Hyderabad' : 'NIT Warangal',
        contactNumber: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fn}${ln}${i}`
      });
      savedParticipants.push(await p.save());
    }
    console.log(`Created 50 Participants`);

    // Generate 20 Events
    const eventTypes = ['normal', 'normal', 'normal', 'merchandise'];
    for (let i = 0; i < 25; i++) {
      const org = savedClubs[Math.floor(Math.random() * savedClubs.length)];
      const eType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 60)); // future events
      const endDate = new Date(eventDate);
      endDate.setHours(eventDate.getHours() + 4);

      const regDate = new Date(eventDate);
      regDate.setDate(regDate.getDate() - 1);

      const isTeam = Math.random() > 0.6;

      const evt = new Event({
        eventName: `${org.name} - Signature Event ${i + 1}`,
        eventDescription: `An amazing event hosted by ${org.name}. Join us for an unforgettable experience.`,
        eventType: eType,
        eligibility: Math.random() > 0.8 ? 'iiit-only' : 'all',
        eventStartDate: eventDate,
        eventEndDate: endDate,
        registrationDeadline: regDate,
        registrationFee: Math.floor(Math.random() * 5) * 100, // 0, 100, 200, 300, 400
        registrationLimit: Math.floor(Math.random() * 10) * 50 || null,
        organizer: org._id,
        tags: [org.category.split(' ')[0].toLowerCase(), 'felicity', 'fun'],
        isTeamEvent: isTeam,
        minTeamSize: isTeam ? 2 : 1,
        maxTeamSize: isTeam ? 4 : 1
      });

      if (eType === 'merchandise') {
        evt.items = [{
          itemName: `${org.name} Official Merch`,
          sizes: ['S', 'M', 'L', 'XL'],
          stockQuantity: 100,
          price: 500
        }];
      }

      await evt.save();
    }
    console.log(`Created 25 Events`);

    console.log('Database seeded successfully with massive dataset!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
