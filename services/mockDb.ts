import { DbSchema, Team, User, Volunteer, Announcement, HackathonConfig } from '../types';

const DB_KEY = 'vignans_hackfest_db_v1';

const INITIAL_CONFIG: HackathonConfig = {
  startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Started 2 hours ago
  endTime: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(), // Ends in 22 hours
};

const INITIAL_USERS: User[] = [
  { id: 'u1', email: 'admin@vignan.com', name: 'Admin User', role: 'admin' },
  { id: 'u2', email: 'volunteer@vignan.com', name: 'John Volunteer', role: 'volunteer' },
  { id: 'u3', email: 'team@vignan.com', name: 'Team Alpha', role: 'team' },
];

const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: 'u2', name: 'John Volunteer', email: 'volunteer@vignan.com', phone: '+91 98765 43210', role: 'Floor Support' },
  { id: 'v2', name: 'Sarah Tech', email: 'sarah@vignan.com', phone: '+91 91234 56789', role: 'Technical Mentor' },
];

const INITIAL_TEAMS: Team[] = [
  {
    id: 'u3',
    name: 'Team Alpha',
    email: 'team@vignan.com',
    members: ['Alice', 'Bob', 'Charlie'],
    problemStatement: 'AI-driven Traffic Management System',
    roomNumber: 'A-101',
    tableNumber: 'T-05',
    wifiSsid: 'Vignan-Guest',
    wifiPass: 'Hackfest2024!',
    assignedVolunteerId: 'u2',
    isCheckedIn: false,
    score: 0,
  },
  {
    id: 't2',
    name: 'Code Warriors',
    email: 'warriors@vignan.com',
    members: ['Dave', 'Eve'],
    problemStatement: 'Blockchain Voting App',
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
  },
  {
    id: 't3',
    name: 'Pixel Perfect',
    email: 'pixel@vignan.com',
    members: ['Frank', 'Grace', 'Heidi'],
    problemStatement: 'AR Education Tool',
    roomNumber: 'B-202',
    tableNumber: 'T-12',
    wifiSsid: 'Vignan-Guest',
    wifiPass: 'Hackfest2024!',
    assignedVolunteerId: 'v2',
    isCheckedIn: false,
    score: 0,
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', message: 'Welcome to Vignan\'s Hackfest! Hacking begins now.', createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), author: 'Admin' },
  { id: 'a2', message: 'Lunch is being served in the cafeteria.', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), author: 'Admin' },
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

  async login(email: string, password: string): Promise<User | null> {
    await delay(500);
    const db = dbService.getDb();
    // Simplified login: password check ignored for mock, just matching email
    // In a real app, verify hash.
    // Password Hints: 
    // admin@vignan.com / admin123
    // volunteer@vignan.com / vol123
    // team@vignan.com / team123
    
    // Simple mock logic:
    if (password.length < 3) return null;
    
    const user = db.users.find(u => u.email === email);
    return user || null;
  },

  async getTeam(id: string): Promise<Team | undefined> {
    await delay(200);
    return dbService.getDb().teams.find(t => t.id === id);
  },

  async updateTeam(updatedTeam: Team): Promise<void> {
    await delay(300);
    const db = dbService.getDb();
    db.teams = db.teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    dbService.saveDb(db);
  },

  async getVolunteer(id: string): Promise<Volunteer | undefined> {
    await delay(200);
    return dbService.getDb().volunteers.find(v => v.id === id);
  },
  
  async getVolunteers(): Promise<Volunteer[]> {
      return dbService.getDb().volunteers;
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

  async postAnnouncement(message: string): Promise<Announcement> {
    await delay(300);
    const db = dbService.getDb();
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      message,
      createdAt: new Date().toISOString(),
      author: 'Admin'
    };
    db.announcements.unshift(newAnnouncement);
    dbService.saveDb(db);
    return newAnnouncement;
  },

  async getConfig(): Promise<HackathonConfig> {
    return dbService.getDb().config;
  },
  
  async createTeam(team: Team): Promise<void> {
      const db = dbService.getDb();
      db.teams.push(team);
      // Also add to users so they can log in
      if (!db.users.find(u => u.id === team.id)) {
          db.users.push({
              id: team.id,
              email: team.email,
              name: team.name,
              role: 'team'
          });
      }
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
  }
};