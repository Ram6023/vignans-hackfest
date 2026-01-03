export type Role = 'admin' | 'volunteer' | 'team';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Team {
  id: string;
  name: string;
  email: string;
  members: string[]; // comma separated or array
  problemStatement: string;
  roomNumber: string;
  tableNumber: string;
  wifiSsid: string;
  wifiPass: string;
  assignedVolunteerId: string;
  isCheckedIn: boolean;
  checkInTime?: string; // ISO string
  submissionLink?: string;
  submissionTime?: string; // ISO string
  submissionViewed?: boolean;
  score?: number;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string; // e.g., "Floor Support", "Tech Mentor"
}

export interface Announcement {
  id: string;
  message: string;
  createdAt: string; // ISO string
  author: string;
}

export interface HackathonConfig {
  startTime: string; // ISO string
  endTime: string; // ISO string
}

// Initial Mock Data Interfaces
export interface DbSchema {
  users: User[]; // Auth users
  teams: Team[];
  volunteers: Volunteer[];
  announcements: Announcement[];
  config: HackathonConfig;
}