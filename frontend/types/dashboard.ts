// RecentActivity

export type ActivityStatus =
  | "Approved"
  | "Pending"
  | "Completed"
  | "Successful"
  | "Rejected";

export interface ActivityRow {
  id: string;
  userName: string;
  userEmail: string;
  avatarSeed: string;
  action: string;
  date: string;
  status: ActivityStatus;
}
