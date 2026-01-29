import { DbSchema, Team, User, Volunteer, Announcement, HackathonConfig, ScheduleEvent, ProblemStatement } from '../types';
import { wsService } from './websocket';

const DB_KEY = 'vignans_hackfest_prod_v1.2';

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
  { id: 'admin', email: 'admin@vignan.com', name: 'System Admin', role: 'admin' },
  { id: 'volunteer-1', email: 'volunteer@vignan.com', name: 'Sarah Wilson', role: 'volunteer' },
  { id: 'team-1', email: 'team@vignan.com', name: 'Alpha Coders', role: 'team' },
  { id: 'judge-1', email: 'judge@vignan.com', name: 'Dr. Robert Fox', role: 'judge' },
];

const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'volunteer-1',
    name: 'Sarah Wilson',
    email: 'volunteer@vignan.com',
    phone: '9876543210',
    role: 'Technical Mentor',
    specialization: 'Full Stack Development',
    isAvailable: true
  },
  {
    id: 'volunteer-2',
    name: 'David Miller',
    email: 'david@vignan.com',
    phone: '9871234560',
    role: 'UI/UX Mentor',
    specialization: 'Design Systems',
    isAvailable: true
  }
];

const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Alpha Coders',
    email: 'team@vignan.com',
    members: ['Alex Rivera', 'Jordan Smith', 'Taylor Chen'],
    problemStatement: 'Smart City Traffic Management',
    roomNumber: 'Main Hall',
    tableNumber: '42',
    wifiSsid: 'Hackfest_Guest',
    wifiPass: 'innovate2025',
    assignedVolunteerId: 'volunteer-1',
    isCheckedIn: true,
    checkInTime: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    onboardingStatus: 'active',
    sessions: [
      {
        id: 'sess-1',
        type: 'active',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
      }
    ],
    currentSessionStart: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    totalActiveTime: 0,
    totalBreakTime: 0
  },
  {
    id: 'team-2',
    name: 'Byte Busters',
    email: 'byte@vignan.com',
    members: ['Maya Patel', 'Liam Wong'],
    problemStatement: 'Sustainable Energy Grid',
    roomNumber: 'Room 204',
    tableNumber: '15',
    wifiSsid: 'Hackfest_Guest',
    wifiPass: 'innovate2025',
    assignedVolunteerId: 'volunteer-2',
    isCheckedIn: false,
    onboardingStatus: 'not_started',
    sessions: [],
    totalActiveTime: 0,
    totalBreakTime: 0
  },
  {
    id: 'team-3',
    name: 'Code Ninjas',
    email: 'ninjas@vignan.com',
    members: ['Priya Sharma', 'Raj Kumar', 'Anita Desai'],
    problemStatement: 'Health-Track AI',
    roomNumber: 'Room 301',
    tableNumber: '08',
    wifiSsid: 'Hackfest_Guest',
    wifiPass: 'innovate2025',
    assignedVolunteerId: 'volunteer-1',
    isCheckedIn: false,
    onboardingStatus: 'not_started',
    sessions: [],
    totalActiveTime: 0,
    totalBreakTime: 0
  }
];

const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Opening Ceremony',
    description: 'Welcome and Keynote Speech by Chief Guest',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    type: 'ceremony',
    location: 'Main Auditorium',
    isCompleted: true
  },
  {
    id: '2',
    title: 'Hacking Starts!',
    description: 'Begin working on your innovative solutions',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString(),
    type: 'deadline',
    location: 'Hacking Bays'
  },
  {
    id: '3',
    title: 'Lunch Break',
    description: 'Refresh and recharge',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    type: 'meal',
    location: 'Food Court'
  },
  {
    id: '4',
    title: 'Technical Workshop',
    description: 'Introduction to Cloud Infrastructure',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    type: 'workshop',
    location: 'Seminar Hall'
  }
];

const INITIAL_PROBLEM_STATEMENTS: ProblemStatement[] = [
  {
    id: 'ps1',
    title: 'Smart City Traffic Management',
    description: 'Develop an AI-driven system to optimize traffic signal timings in real-time based on traffic density and emergency vehicle priority.',
    category: 'Transportation',
    difficulty: 'intermediate',
    sponsor: 'Urban Mobility Dept'
  },
  {
    id: 'ps2',
    title: 'Sustainable Energy Grid',
    description: 'Create a decentralized energy management platform for sharing renewable energy within local communities using blockchain.',
    category: 'Sustainability',
    difficulty: 'advanced',
    sponsor: 'GreenTech Solutions'
  },
  {
    id: 'ps3',
    title: 'Health-Track AI',
    description: 'A wearable solution for early detection of respiratory issues using non-invasive sensors and edge computing.',
    category: 'Healthcare',
    difficulty: 'intermediate',
    sponsor: 'Vignan Biotech'
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    message: 'Welcome to Vignan\'s Hackfest 2025! Let the innovation begin.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    author: 'Admin',
    priority: 'normal',
    category: 'general'
  },
  {
    id: 'ann2',
    message: 'Technical workshop on Cloud Infrastructure starting in 15 mins in Seminar Hall.',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    author: 'Admin',
    priority: 'important',
    category: 'technical'
  },
  {
    id: 'ann3',
    message: 'Food token distribution has started at the registration desk.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    author: 'Admin',
    priority: 'normal',
    category: 'food'
  }
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

  async getJudges(): Promise<User[]> {
    return dbService.getDb().users.filter(u => u.role === 'judge');
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
  },

  async assignJudge(teamId: string, judgeId: string): Promise<void> {
    const db = dbService.getDb();
    const team = db.teams.find(t => t.id === teamId);
    if (team) {
      team.assignedJudgeId = judgeId;
      dbService.saveDb(db);
      // We could add a wsService call here if needed, but for now simple update is fine
      wsService.teamUpdated(team);
    }
  },

  // Judging methods
  async getTeamsByRoom(room: string): Promise<Team[]> {
    await delay(200);
    const db = dbService.getDb();
    if (!room) return db.teams;
    return db.teams.filter(t => t.roomNumber.toLowerCase().includes(room.toLowerCase()));
  },

  async updateJudging(teamId: string, score: number, remarks: string, round?: 'round1' | 'round2' | 'round3' | 'round4'): Promise<void> {
    await delay(300);
    const db = dbService.getDb();
    const team = db.teams.find(t => t.id === teamId);
    if (team) {
      if (round) {
        if (!team.roundScores) team.roundScores = {};
        if (!team.roundRemarks) team.roundRemarks = {};

        const roundKeyMap = {
          'round1': 'ideaElevation',
          'round2': 'frontendLogics',
          'round3': 'backendTechnicality',
          'round4': 'finalRound'
        } as const;

        const key = roundKeyMap[round];
        (team.roundScores as any)[key] = score;
        (team.roundRemarks as any)[key] = remarks;

        // Update total score as sum of rounds
        team.score = (team.roundScores.ideaElevation || 0) +
          (team.roundScores.frontendLogics || 0) +
          (team.roundScores.backendTechnicality || 0) +
          (team.roundScores.finalRound || 0);

        // Update judge remarks to show a summary or the latest round?
        // Let's keep the main judgeRemarks as a general feedback or from the final round
        if (round === 'round4') {
          team.judgeRemarks = remarks;
        }
      } else {
        team.score = score;
        team.judgeRemarks = remarks;
      }

      dbService.saveDb(db);
      wsService.scoreUpdated(team);
    }
  },

  // ========================================
  // TIME TRACKING METHODS (GDG Agentathon Style)
  // ========================================

  // Start team onboarding - First check-in
  async startOnboarding(teamId: string): Promise<Team> {
    await delay(200);
    const db = dbService.getDb();
    const team = db.teams.find(t => t.id === teamId);

    if (!team) throw new Error('Team not found');

    const now = new Date().toISOString();
    const sessionId = `sess-${Date.now()}`;

    team.onboardingStatus = 'active';
    team.isCheckedIn = true;
    team.checkInTime = now;
    team.currentSessionStart = now;
    team.sessions = team.sessions || [];
    team.sessions.push({
      id: sessionId,
      type: 'active',
      startTime: now
    });
    team.totalActiveTime = team.totalActiveTime || 0;
    team.totalBreakTime = team.totalBreakTime || 0;

    dbService.saveDb(db);
    wsService.teamCheckedIn(team);

    return team;
  },

  // Start a break for the team
  async startBreak(teamId: string, reason: string = 'break'): Promise<Team> {
    await delay(200);
    const db = dbService.getDb();
    const team = db.teams.find(t => t.id === teamId);

    if (!team) throw new Error('Team not found');
    if (team.onboardingStatus !== 'active') throw new Error('Team is not currently active');

    const now = new Date().toISOString();

    // Close current active session
    if (team.currentSessionStart && team.sessions) {
      const lastSession = team.sessions[team.sessions.length - 1];
      if (lastSession && lastSession.type === 'active' && !lastSession.endTime) {
        lastSession.endTime = now;
        const duration = new Date(now).getTime() - new Date(lastSession.startTime).getTime();
        team.totalActiveTime = (team.totalActiveTime || 0) + duration;
      }
    }

    // Start break session
    const sessionId = `sess-${Date.now()}`;
    team.onboardingStatus = 'on_break';
    team.currentSessionStart = now;
    team.breakReason = reason;
    team.sessions = team.sessions || [];
    team.sessions.push({
      id: sessionId,
      type: 'break',
      startTime: now,
      reason
    });

    dbService.saveDb(db);
    wsService.teamUpdated(team);

    return team;
  },

  // End break and resume active session
  async endBreak(teamId: string): Promise<Team> {
    await delay(200);
    const db = dbService.getDb();
    const team = db.teams.find(t => t.id === teamId);

    if (!team) throw new Error('Team not found');
    if (team.onboardingStatus !== 'on_break') throw new Error('Team is not currently on break');

    const now = new Date().toISOString();

    // Close current break session
    if (team.currentSessionStart && team.sessions) {
      const lastSession = team.sessions[team.sessions.length - 1];
      if (lastSession && lastSession.type === 'break' && !lastSession.endTime) {
        lastSession.endTime = now;
        const duration = new Date(now).getTime() - new Date(lastSession.startTime).getTime();
        team.totalBreakTime = (team.totalBreakTime || 0) + duration;
      }
    }

    // Start new active session
    const sessionId = `sess-${Date.now()}`;
    team.onboardingStatus = 'active';
    team.currentSessionStart = now;
    team.breakReason = undefined;
    team.sessions = team.sessions || [];
    team.sessions.push({
      id: sessionId,
      type: 'active',
      startTime: now
    });

    dbService.saveDb(db);
    wsService.teamUpdated(team);

    return team;
  },

  // Complete onboarding - Final check-out
  async completeOnboarding(teamId: string): Promise<Team> {
    await delay(200);
    const db = dbService.getDb();
    const team = db.teams.find(t => t.id === teamId);

    if (!team) throw new Error('Team not found');

    const now = new Date().toISOString();

    // Close current session (active or break)
    if (team.currentSessionStart && team.sessions) {
      const lastSession = team.sessions[team.sessions.length - 1];
      if (lastSession && !lastSession.endTime) {
        lastSession.endTime = now;
        const duration = new Date(now).getTime() - new Date(lastSession.startTime).getTime();
        if (lastSession.type === 'active') {
          team.totalActiveTime = (team.totalActiveTime || 0) + duration;
        } else {
          team.totalBreakTime = (team.totalBreakTime || 0) + duration;
        }
      }
    }

    team.onboardingStatus = 'completed';
    team.currentSessionStart = undefined;
    team.breakReason = undefined;

    dbService.saveDb(db);
    wsService.teamUpdated(team);

    return team;
  },

  // Get real-time active duration (including current session)
  getActiveTime(team: Team): number {
    let total = team.totalActiveTime || 0;

    if (team.onboardingStatus === 'active' && team.currentSessionStart) {
      const currentDuration = Date.now() - new Date(team.currentSessionStart).getTime();
      total += currentDuration;
    }

    return total;
  },

  // Get real-time break duration (including current session)
  getBreakTime(team: Team): number {
    let total = team.totalBreakTime || 0;

    if (team.onboardingStatus === 'on_break' && team.currentSessionStart) {
      const currentDuration = Date.now() - new Date(team.currentSessionStart).getTime();
      total += currentDuration;
    }

    return total;
  }
};