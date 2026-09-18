type TabId =
  | "general"
  | "notifications"
  | "security"
  | "payment"
  | "content-moderation"

  interface SettingsState {
  // General Settings
  platformName: string;
  platformDescription: string;
  defaultLanguage: string;
  timezone: string;
  maintenanceMode: boolean;

  // User Registration Settings
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  minimumAge: number;
  kycRequiredForEvents: boolean;

  // Event Settings
  maxEventCapacity: number;
  allowPaidEvents: boolean;
  platformCommission: number;
  autoApproveEvents: boolean;
  eventCreationRequiresKyc: boolean;

  // Community Settings
  maxCommunitiesPerUser: number;
  allowPrivateCommunities: boolean;
  requireAdminApproval: boolean;
  maxMembersPerCommunity: number;
}

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

interface FieldShellProps {
  label: string;
  description: string;
  htmlFor?: string;
  children: React.ReactNode;
}

interface TextFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface NumberFieldProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  className?: string;
}

interface SelectFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}

interface PanelProps {
  title: string;
  children: React.ReactNode;
}

interface EmailRecipientProps {
  emails: string[];
  onChange: (emails: string[]) => void;
}
