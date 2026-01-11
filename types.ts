export type Role = 'admin' | 'volunteer' | 'team';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  email: string;
  members: string[];
  problemStatement: string;
  roomNumber: string;
  tableNumber: string;
  wifiSsid: string;
  wifiPass: string;
  assignedVolunteerId: string;
  isCheckedIn: boolean;
  checkInTime?: string;
  submissionLink?: string;
  submissionTime?: string;
  submissionViewed?: boolean;
  score?: number;
  techStack?: string[];
  projectDescription?: string;
  teamSize?: number;
  lookingForMembers?: boolean;
  skills?: string[];
  gitRepoLink?: string;
  youtubeLiveLink?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialization?: string;
  isAvailable?: boolean;
}

export interface Announcement {
  id: string;
  message: string;
  createdAt: string;
  author: string;
  priority?: 'normal' | 'important' | 'urgent';
  category?: 'general' | 'food' | 'technical' | 'schedule' | 'submission';
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'ceremony' | 'workshop' | 'meal' | 'judging' | 'networking' | 'deadline' | 'break';
  location?: string;
  speaker?: string;
  isCompleted?: boolean;
}

export interface HackathonConfig {
  startTime: string;
  endTime: string;
  eventName?: string;
  venue?: string;
  maxTeamSize?: number;
  minTeamSize?: number;
  registrationOpen?: boolean;
  submissionDeadline?: string;
}

export interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sponsor?: string;
}

// Initial Mock Data Interfaces
export interface DbSchema {
  users: User[];
  teams: Team[];
  volunteers: Volunteer[];
  announcements: Announcement[];
  config: HackathonConfig;
  schedule: ScheduleEvent[];
  problemStatements: ProblemStatement[];
}