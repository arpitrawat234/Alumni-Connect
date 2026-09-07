import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { User, UserRole, VerificationStatus, UserSchema } from '../users/user.schema';
import { AlumniProfile, AlumniProfileSchema } from '../profiles/schemas/alumni-profile.schema';
import { StudentProfile, StudentProfileSchema } from '../profiles/schemas/student-profile.schema';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in server/.env');
  process.exit(1);
}

const seedAlumniData = [
  {
    name: 'Aman Sharma',
    email: 'aman.sharma@microsoft.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'Maharaja Agrasen Institute of Technology (MAIT)',
      graduationYear: 2022,
      currentCompany: 'Microsoft',
      currentRole: 'Software Engineer',
      industry: 'Technology',
      location: 'Bengaluru, India',
      skills: ['React', 'Node.js', 'MongoDB', 'Azure', 'TypeScript', 'DSA'],
      bio: 'Full-stack software engineer building scalable cloud collaboration tools in Microsoft Teams. Passionate about mentoring junior developers.',
      experience: '3+ years at Microsoft. Converted internship to SDE II in 2024.',
      helpTopics: [
        'Placement Preparation',
        'DSA',
        'Technical Interviews',
        'Resume Review',
        'Mock Interviews',
      ],
      servicesOffered: ['1-on-1 Sessions', 'Q&A', 'Resume Reviews'],
    },
  },
  {
    name: 'Priya Verma',
    email: 'priya.verma@amazon.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'Delhi Technological University (DTU)',
      graduationYear: 2021,
      currentCompany: 'Amazon',
      currentRole: 'Backend Engineer',
      industry: 'Technology',
      location: 'Hyderabad, India',
      skills: ['Java', 'Spring Boot', 'AWS', 'DynamoDB', 'Distributed Systems', 'Kafka'],
      bio: 'Backend specialist architecting high-throughput inventory management microservices handling millions of daily transactions at AWS.',
      experience: '4 years experience in distributed backend architectures.',
      helpTopics: [
        'Technical Interviews',
        'System Design Basics',
        'Resume Review',
        'Placement Preparation',
      ],
      servicesOffered: ['1-on-1 Sessions', 'Q&A', 'Group Sessions'],
    },
  },
  {
    name: 'Rohan Kulkarni',
    email: 'rohan.k@google.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'BITS Pilani',
      graduationYear: 2020,
      currentCompany: 'Google',
      currentRole: 'Frontend Developer',
      industry: 'Technology',
      location: 'Bengaluru, India',
      skills: ['React', 'Next.js', 'Web Performance', 'TypeScript', 'GraphQL'],
      bio: 'UI architect obsessing over sub-millisecond web rendering, interactive graphics, accessibility, and modern React ecosystems.',
      experience: '5 years crafting high-performance user interfaces at scale.',
      helpTopics: [
        'Frontend Engineering',
        'Mock Interviews',
        'Resume Review',
        'Career Guidance',
      ],
      servicesOffered: ['1-on-1 Sessions', 'Resume Reviews'],
    },
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@goldmansachs.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'IIT Roorkee',
      graduationYear: 2022,
      currentCompany: 'Goldman Sachs',
      currentRole: 'Data Scientist',
      industry: 'Finance',
      location: 'Bengaluru, India',
      skills: ['Python', 'Machine Learning', 'PyTorch', 'SQL', 'Quantitative Modeling'],
      bio: 'Building quantitative trading models, algorithmic risk mitigation systems, and automated financial forecasting pipelines.',
      experience: '3 years in Quantitative Analytics and Financial Machine Learning.',
      helpTopics: [
        'Higher Studies',
        'Technical Interviews',
        'Career Guidance',
        'Resume Review',
      ],
      servicesOffered: ['1-on-1 Sessions', 'Q&A'],
    },
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.m@atlassian.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'Netaji Subhas University of Technology (NSUT)',
      graduationYear: 2023,
      currentCompany: 'Atlassian',
      currentRole: 'Software Engineer',
      industry: 'Technology',
      location: 'Bengaluru, India',
      skills: ['React', 'GraphQL', 'Java', 'Docker', 'Kubernetes', 'Microservices'],
      bio: 'Contributing to Jira Cloud Core team. Enthusiastic about CI/CD, developer tooling, and modern distributed systems.',
      experience: '2 years working on Jira real-time collaborative editors.',
      helpTopics: [
        'Placement Preparation',
        'DSA',
        'HR Interviews',
        'Mock Interviews',
      ],
      servicesOffered: ['1-on-1 Sessions', 'Resume Reviews', 'Q&A'],
    },
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@mckinsey.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'IIM Ahmedabad / NIT Trichy',
      graduationYear: 2019,
      currentCompany: 'McKinsey',
      currentRole: 'Product Manager',
      industry: 'Consulting',
      location: 'Mumbai, India',
      skills: ['Product Strategy', 'User Research', 'Agile', 'Roadmapping', 'Data Analytics'],
      bio: 'Helping Fortune 500 enterprises navigate digital transformation and user-centric product growth loops.',
      experience: '6 years in Technology Strategy and Digital Product Leadership.',
      helpTopics: [
        'Career Guidance',
        'HR Interviews',
        'Higher Studies',
        'Resume Review',
      ],
      servicesOffered: ['1-on-1 Sessions', 'Group Sessions', 'Q&A'],
    },
  },
  {
    name: 'Devansh Nair',
    email: 'devansh.n@uber.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'IIIT Hyderabad',
      graduationYear: 2021,
      currentCompany: 'Uber',
      currentRole: 'Backend Engineer',
      industry: 'Technology',
      location: 'Hyderabad, India',
      skills: ['Go', 'Kafka', 'Redis', 'gRPC', 'Kubernetes', 'Distributed Systems'],
      bio: 'Engineering high-frequency geospatial dispatch matching engines and surge pricing algorithms handling peak city traffic.',
      experience: '4 years building high concurrency Golang backend microservices.',
      helpTopics: [
        'DSA',
        'Technical Interviews',
        'Placement Preparation',
        'Mock Interviews',
      ],
      servicesOffered: ['1-on-1 Sessions', 'Resume Reviews'],
    },
  },
  {
    name: 'Tanvi Deshmukh',
    email: 'tanvi.d@google.com',
    role: UserRole.ALUMNI,
    verificationStatus: VerificationStatus.VERIFIED,
    profile: {
      college: 'IIT Delhi',
      graduationYear: 2022,
      currentCompany: 'Google',
      currentRole: 'Software Engineer',
      industry: 'Technology',
      location: 'Bengaluru, India',
      skills: ['C++', 'Python', 'LLMs', 'Information Retrieval', 'DSA'],
      bio: 'Working on Google Search ranking and natural language semantic retrieval pipelines. AI researcher and competitive programmer.',
      experience: '3 years in Google Core Search ranking algorithms.',
      helpTopics: [
        'DSA',
        'Competitive Programming',
        'Technical Interviews',
        'Mock Interviews',
      ],
      servicesOffered: ['1-on-1 Sessions', 'Q&A'],
    },
  },
];

async function seed() {
  console.log('🌱 Starting AlumniConnect Database Seeder...');
  await mongoose.connect(MONGODB_URI as string);
  console.log('✓ Connected to MongoDB Atlas');

  const UserModel = mongoose.model(User.name, UserSchema);
  const AlumniProfileModel = mongoose.model(AlumniProfile.name, AlumniProfileSchema);
  const StudentProfileModel = mongoose.model(StudentProfile.name, StudentProfileSchema);

  // Clear existing seeded users
  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  // Seed sample student
  const sampleStudentEmail = 'student@alumniconnect.com';
  let studentUser = await UserModel.findOne({ email: sampleStudentEmail });
  if (!studentUser) {
    studentUser = await UserModel.create({
      name: 'Arpit Sharma (Student)',
      email: sampleStudentEmail,
      passwordHash: defaultPasswordHash,
      role: UserRole.STUDENT,
      verificationStatus: VerificationStatus.VERIFIED,
    });
    await StudentProfileModel.create({
      userId: studentUser._id,
      college: 'Maharaja Agrasen Institute of Technology',
      branch: 'Computer Science and Engineering',
      graduationYear: 2026,
      skills: ['React', 'JavaScript', 'Node.js', 'Data Structures', 'Git'],
      careerInterests: ['Software Engineering', 'Full Stack Development', 'Cloud'],
      bio: 'Pre-final year CSE student actively preparing for product company placements.',
    });
    console.log(`✓ Seeded Demo Student: ${sampleStudentEmail}`);
  }

  // Seed verified alumni
  for (const item of seedAlumniData) {
    let alumniUser = await UserModel.findOne({ email: item.email });
    if (!alumniUser) {
      alumniUser = await UserModel.create({
        name: item.name,
        email: item.email,
        passwordHash: defaultPasswordHash,
        role: item.role,
        verificationStatus: item.verificationStatus,
      });

      await AlumniProfileModel.create({
        userId: alumniUser._id,
        ...item.profile,
      });
      console.log(`✓ Seeded Verified Alumni: ${item.name} (${item.profile.currentCompany})`);
    }
  }

  console.log('\n🎉 Seeding completed successfully!');
  console.log('Credentials for all demo accounts:');
  console.log('Password: Password123!');
  console.log('Demo Student: student@alumniconnect.com');
  console.log('Demo Alumni: aman.sharma@microsoft.com, priya.verma@amazon.com, etc.');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
