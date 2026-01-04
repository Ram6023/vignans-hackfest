import { DbSchema, Team, User, Volunteer, Announcement, HackathonConfig, ScheduleEvent, ProblemStatement } from '../types';
import { wsService } from './websocket';

const DB_KEY = 'vignans_hackfest_db_v2';

const INITIAL_CONFIG: HackathonConfig = {
  startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  endTime: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
  eventName: "Vignan's Hackfest 2025",
  venue: 'Vignan University Campus, Main Auditorium',
  maxTeamSize: 4,
  minTeamSize: 2,
  registrationOpen: true,
  submissionDeadline: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
};

const INITIAL_USERS: User[] = [
  { id: 'u1', email: 'admin@vignan.com', name: 'Admin User', role: 'admin' },
  { id: 'u2', email: 'volunteer@vignan.com', name: 'John Volunteer', role: 'volunteer' },
  { id: 'u3', email: 'team@vignan.com', name: 'Team Alpha', role: 'team' },
];

const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: 'u2', name: 'John Volunteer', email: 'volunteer@vignan.com', phone: '+91 98765 43210', role: 'Floor Support', specialization: 'General Support', isAvailable: true },
  { id: 'v2', name: 'Sarah Tech', email: 'sarah@vignan.com', phone: '+91 91234 56789', role: 'Technical Mentor', specialization: 'Web Development', isAvailable: true },
  { id: 'v3', name: 'Raj Kumar', email: 'raj@vignan.com', phone: '+91 87654 32109', role: 'Technical Mentor', specialization: 'AI/ML', isAvailable: true },
  { id: 'v4', name: 'Priya Sharma', email: 'priya@vignan.com', phone: '+91 76543 21098', role: 'Design Mentor', specialization: 'UI/UX Design', isAvailable: false },
];

const INITIAL_TEAMS: Team[] = [
  {
    id: 'u3',
    name: 'Team Alpha',
    email: 'team@vignan.com',
    members: ['Alice', 'Bob', 'Charlie'],
    problemStatement: 'AI-driven Traffic Management System',
    projectDescription: 'Building an intelligent traffic management system using computer vision and ML to optimize signal timing.',
    roomNumber: 'A-101',
    tableNumber: 'T-05',
    wifiSsid: 'Vignan-Guest',
    wifiPass: 'Hackfest2024!',
    assignedVolunteerId: 'u2',
    isCheckedIn: false,
    score: 0,
    techStack: ['Python', 'TensorFlow', 'React', 'Node.js'],
    skills: ['Machine Learning', 'Computer Vision', 'Web Development'],
    lookingForMembers: false,
  },
  {
    id: 't2',
    name: 'Code Warriors',
    email: 'warriors@vignan.com',
    members: ['Dave', 'Eve'],
    problemStatement: 'Blockchain Voting App',
    projectDescription: 'A secure and transparent voting application built on blockchain technology.',
    roomNumber: 'A-101',
    tableNumber: 'T-06',
    wifiSsid: 'Vignan-Guest',
    wifiPass: 'Hackfest2024!',
    assignedVolunteerId: 'u2',
    isCheckedIn: true,
    checkInTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    submissionLink: 'https://github.com/warriors/voting',
    submissionTime: new Date().toISOString(),
    score: 85,
    techStack: ['Solidity', 'React', 'Ethereum'],
    skills: ['Blockchain', 'Smart Contracts', 'Frontend'],
    lookingForMembers: true,
  },
  {
    id: 't3',
    name: 'Pixel Perfect',
    email: 'pixel@vignan.com',
    members: ['Frank', 'Grace', 'Heidi'],
    problemStatement: 'AR Education Tool',
    projectDescription: 'An augmented reality application to make learning interactive and fun for students.',
    roomNumber: 'B-202',
    tableNumber: 'T-12',
    wifiSsid: 'Vignan-Guest',
    wifiPass: 'Hackfest2024!',
    assignedVolunteerId: 'v2',
    isCheckedIn: false,
    score: 0,
    techStack: ['Unity', 'ARCore', 'C#'],
    skills: ['AR/VR', 'Game Development', '3D Modeling'],
    lookingForMembers: false,
  },
  {
    id: 't4',
    name: 'Green Innovators',
    email: 'green@vignan.com',
    members: ['Ivan', 'Julia'],
    problemStatement: 'Smart Waste Management System',
    projectDescription: 'IoT-based waste management solution for smart cities.',
    roomNumber: 'B-203',
    tableNumber: 'T-14',
    wifiSsid: 'Vignan-Guest',
    wifiPass: 'Hackfest2024!',
    assignedVolunteerId: 'v3',
    isCheckedIn: true,
    checkInTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    score: 0,
    techStack: ['Arduino', 'Python', 'React Native'],
    skills: ['IoT', 'Hardware', 'Mobile Development'],
    lookingForMembers: true,
  },
  {
    id: 't5',
    name: 'Health Heroes',
    email: 'health@vignan.com',
    members: ['Kevin', 'Laura', 'Mike', 'Nina'],
    problemStatement: 'AI Health Assistant',
    projectDescription: 'AI-powered health monitoring and recommendation system.',
    roomNumber: 'C-301',
    tableNumber: 'T-20',
    wifiSsid: 'Vignan-Guest',
    wifiPass: 'Hackfest2024!',
    assignedVolunteerId: 'v3',
    isCheckedIn: true,
    checkInTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    submissionLink: 'https://github.com/healthheroes/ai-assistant',
    submissionTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    score: 92,
    techStack: ['Python', 'FastAPI', 'React', 'TensorFlow'],
    skills: ['AI/ML', 'Healthcare', 'Full Stack'],
    lookingForMembers: false,
  }
];

const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: 's1',
    title: 'Opening Ceremony',
    description: 'Welcome address and hackathon kickoff',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    type: 'ceremony',
    location: 'Main Auditorium',
    isCompleted: true,
  },
  {
    id: 's2',
    title: 'Team Formation & Ideation',
    description: 'Form teams and brainstorm project ideas',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: 'networking',
    location: 'Collaboration Zone',
    isCompleted: true,
  },
  {
    id: 's3',
    title: 'Hacking Begins!',
    description: 'Start building your projects',
    startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
    type: 'deadline',
    location: 'All Hacking Zones',
    isCompleted: false,
  },
  {
    id: 's4',
    title: 'Workshop: Building with AI APIs',
    description: 'Learn how to integrate AI services into your project',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    type: 'workshop',
    location: 'Workshop Room A',
    speaker: 'Dr. Anil Kumar - AI Expert',
    isCompleted: false,
  },
  {
    id: 's5',
    title: 'Lunch Break',
    description: 'Refuel and network with other participants',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    type: 'meal',
    location: 'Cafeteria',
    isCompleted: false,
  },
  {
    id: 's6',
    title: 'Workshop: Cloud Deployment',
    description: 'Deploy your project to the cloud in minutes',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 7).toISOString(),
    type: 'workshop',
    location: 'Workshop Room B',
    speaker: 'Sarah Chen - Cloud Architect',
    isCompleted: false,
  },
  {
    id: 's7',
    title: 'Midnight Snacks',
    description: 'Energy boost for the night owls',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 10).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 10.5).toISOString(),
    type: 'meal',
    location: 'Cafeteria',
    isCompleted: false,
  },
  {
    id: 's8',
    title: 'Mentor Office Hours',
    description: 'Get 1-on-1 guidance from industry mentors',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(),
    type: 'networking',
    location: 'Mentor Zone',
    isCompleted: false,
  },
  {
    id: 's9',
    title: 'Submission Deadline',
    description: 'Final project submission closes',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
    type: 'deadline',
    location: 'Online',
    isCompleted: false,
  },
  {
    id: 's10',
    title: 'Judging & Demos',
    description: 'Present your projects to the judges',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 20.5).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
    type: 'judging',
    location: 'Main Auditorium',
    isCompleted: false,
  },
  {
    id: 's11',
    title: 'Closing Ceremony & Awards',
    description: 'Winners announcement and prize distribution',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString(),
    type: 'ceremony',
    location: 'Main Auditorium',
    isCompleted: false,
  },
];

const INITIAL_PROBLEM_STATEMENTS: ProblemStatement[] = [
  {
    id: 'ps1',
    title: 'Smart Traffic Management',
    description: 'Build an AI-powered solution to optimize traffic flow in urban areas using real-time data.',
    category: 'AI/ML',
    difficulty: 'advanced',
    sponsor: 'Google Cloud',
  },
  {
    id: 'ps2',
    title: 'Sustainable Campus',
    description: 'Create a solution to reduce carbon footprint and promote sustainability on college campuses.',
    category: 'Sustainability',
    difficulty: 'intermediate',
    sponsor: 'Green Earth Foundation',
  },
  {
    id: 'ps3',
    title: 'Healthcare Access',
    description: 'Develop a platform to improve healthcare accessibility in rural areas.',
    category: 'Healthcare',
    difficulty: 'intermediate',
  },
  {
    id: 'ps4',
    title: 'Financial Inclusion',
    description: 'Build a solution to bring banking and financial services to the unbanked population.',
    category: 'Fintech',
    difficulty: 'advanced',
    sponsor: 'PayTech Corp',
  },
  {
    id: 'ps5',
    title: 'Education for All',
    description: 'Create an innovative learning platform for students with different learning abilities.',
    category: 'EdTech',
    difficulty: 'beginner',
  },
  {
    id: 'ps6',
    title: 'Open Innovation',
    description: 'Solve any problem that you are passionate about! Creativity is the only limit.',
    category: 'Open Track',
    difficulty: 'beginner',
  },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    message: "🚀 Welcome to Vignan's Hackfest 2025! Let's build something amazing together. Hacking begins now!",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    author: 'Admin',
    priority: 'important',
    category: 'general'
  },
  {
    id: 'a2',
    message: '🍕 Lunch is being served in the cafeteria. Take a break and refuel!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    author: 'Admin',
    priority: 'normal',
    category: 'food'
  },
  {
    id: 'a3',
    message: '💡 Reminder: Workshop on "Building with AI APIs" starts in 2 hours. Don\'t miss it!',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    author: 'Admin',
    priority: 'normal',
    category: 'schedule'
  },
  {
    id: 'a4',
    message: '🛠️ Technical Issue? Visit the Help Desk in Room A-100 or ping a mentor on Discord.',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    author: 'Admin',
    priority: 'normal',
    category: 'technical'
  },
];

const initializeDb = (): DbSchema => {
  const existing = localStorage.getItem(DB_KEY);
  if (existing) {
    return JSON.parse(existing);
  }
  const db: DbSchema = {
    users: INITIAL_USERS,
    teams: INITIAL_TEAMS,
    volunteers: INITIAL_VOLUNTEERS,
    announcements: INITIAL_ANNOUNCEMENTS,
    config: INITIAL_CONFIG,
    schedule: INITIAL_SCHEDULE,
    problemStatements: INITIAL_PROBLEM_STATEMENTS,
  };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
};

// Helper to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dbService = {
  getDb: (): DbSchema => {
    return initializeDb();
  },

  saveDb: (db: DbSchema) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  },

  resetDb: () => {
    localStorage.removeItem(DB_KEY);
    return initializeDb();
  },

  async login(email: string, password: string): Promise<User | null> {
    await delay(500);
    const db = dbService.getDb();
    if (password.length < 3) return null;
    const user = db.users.find(u => u.email === email);
    return user || null;
  },

  async getTeam(id: string): Promise<Team | undefined> {
    await delay(200);
    return dbService.getDb().teams.find(t => t.id === id);
  },

  async updateTeam(updatedTeam: Team, broadcast: boolean = true): Promise<void> {
    await delay(300);
    const db = dbService.getDb();
    db.teams = db.teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    dbService.saveDb(db);

    if (broadcast) {
      wsService.teamUpdated(updatedTeam);
    }
  },

  async getVolunteer(id: string): Promise<Volunteer | undefined> {
    await delay(200);
    return dbService.getDb().volunteers.find(v => v.id === id);
  },

  async getVolunteers(): Promise<Volunteer[]> {
    return dbService.getDb().volunteers;
  },

  async updateVolunteer(updatedVolunteer: Volunteer): Promise<void> {
    const db = dbService.getDb();
    db.volunteers = db.volunteers.map(v => v.id === updatedVolunteer.id ? updatedVolunteer : v);
    dbService.saveDb(db);
  },

  async getTeamsByVolunteer(volunteerId: string): Promise<Team[]> {
    await delay(200);
    return dbService.getDb().teams.filter(t => t.assignedVolunteerId === volunteerId);
  },

  async getAllTeams(): Promise<Team[]> {
    await delay(200);
    return dbService.getDb().teams;
  },

  async getAnnouncements(): Promise<Announcement[]> {
    return dbService.getDb().announcements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async postAnnouncement(message: string, priority: 'normal' | 'important' | 'urgent' = 'normal', category: string = 'general'): Promise<Announcement> {
    await delay(300);
    const db = dbService.getDb();
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      message,
      createdAt: new Date().toISOString(),
      author: 'Admin',
      priority,
      category: category as any,
    };
    db.announcements.unshift(newAnnouncement);
    dbService.saveDb(db);

    // Broadcast real-time
    wsService.announcementPosted(newAnnouncement);

    return newAnnouncement;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    const db = dbService.getDb();
    db.announcements = db.announcements.filter(a => a.id !== id);
    dbService.saveDb(db);
  },

  async getConfig(): Promise<HackathonConfig> {
    return dbService.getDb().config;
  },

  async updateConfig(config: HackathonConfig): Promise<void> {
    const db = dbService.getDb();
    db.config = config;
    dbService.saveDb(db);
  },

  async createTeam(team: Team): Promise<void> {
    const db = dbService.getDb();
    db.teams.push(team);
    if (!db.users.find(u => u.id === team.id)) {
      db.users.push({
        id: team.id,
        email: team.email,
        name: team.name,
        role: 'team'
      });
    }
    dbService.saveDb(db);

    // Broadcast real-time
    wsService.teamCreated(team);
  },

  async deleteTeam(id: string): Promise<void> {
    const db = dbService.getDb();
    db.teams = db.teams.filter(t => t.id !== id);
    db.users = db.users.filter(u => u.id !== id);
    dbService.saveDb(db);
  },

  async createVolunteer(vol: Volunteer): Promise<void> {
    const db = dbService.getDb();
    db.volunteers.push(vol);
    if (!db.users.find(u => u.id === vol.id)) {
      db.users.push({
        id: vol.id,
        email: vol.email,
        name: vol.name,
        role: 'volunteer'
      });
    }
    dbService.saveDb(db);
  },

  async deleteVolunteer(id: string): Promise<void> {
    const db = dbService.getDb();
    db.volunteers = db.volunteers.filter(v => v.id !== id);
    db.users = db.users.filter(u => u.id !== id);
    dbService.saveDb(db);
  },

  // Schedule methods
  async getSchedule(): Promise<ScheduleEvent[]> {
    return dbService.getDb().schedule.sort((a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  },

  async addScheduleEvent(event: ScheduleEvent): Promise<void> {
    const db = dbService.getDb();
    db.schedule.push(event);
    dbService.saveDb(db);
  },

  async updateScheduleEvent(event: ScheduleEvent): Promise<void> {
    const db = dbService.getDb();
    db.schedule = db.schedule.map(e => e.id === event.id ? event : e);
    dbService.saveDb(db);
  },

  async deleteScheduleEvent(id: string): Promise<void> {
    const db = dbService.getDb();
    db.schedule = db.schedule.filter(e => e.id !== id);
    dbService.saveDb(db);
  },

  // Problem Statement methods
  async getProblemStatements(): Promise<ProblemStatement[]> {
    return dbService.getDb().problemStatements;
  },

  async addProblemStatement(ps: ProblemStatement): Promise<void> {
    const db = dbService.getDb();
    db.problemStatements.push(ps);
    dbService.saveDb(db);
  },

  // Check-in with real-time broadcast
  async checkInTeam(team: Team): Promise<Team> {
    const updatedTeam = {
      ...team,
      isCheckedIn: true,
      checkInTime: new Date().toISOString()
    };
    await dbService.updateTeam(updatedTeam, false);
    wsService.teamCheckedIn(updatedTeam);
    return updatedTeam;
  },

  // Submit project with real-time broadcast
  async submitProject(team: Team, submissionLink: string): Promise<Team> {
    const updatedTeam = {
      ...team,
      submissionLink,
      submissionTime: new Date().toISOString()
    };
    await dbService.updateTeam(updatedTeam, false);
    wsService.teamSubmitted(updatedTeam);
    return updatedTeam;
  },

  // Update score with real-time broadcast
  async updateScore(team: Team, score: number): Promise<Team> {
    const updatedTeam = {
      ...team,
      score
    };
    await dbService.updateTeam(updatedTeam, false);
    wsService.scoreUpdated(updatedTeam);
    return updatedTeam;
  },

  // Get teams looking for members
  async getTeamsLookingForMembers(): Promise<Team[]> {
    return dbService.getDb().teams.filter(t => t.lookingForMembers);
  },

  // Assign volunteer to team
  async assignVolunteer(teamId: string, volunteerId: string): Promise<void> {
    const db = dbService.getDb();
    const team = db.teams.find(t => t.id === teamId);
    const volunteer = db.volunteers.find(v => v.id === volunteerId);

    if (team && volunteer) {
      team.assignedVolunteerId = volunteerId;
      dbService.saveDb(db);
      wsService.volunteerAssigned({ team, volunteer });
    }
  }
};