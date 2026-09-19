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

interface NotificationState {
  welcomeEmail: boolean;
  subscriptionConfirmation: boolean;
  paymentReceipt: boolean;
  paymentFailedAlert: boolean;
  eventReminder: boolean;
  kycStatusUpdate: boolean;
  accountDeactivationWarning: boolean;

  newMessage: boolean;
  connectionRequest: boolean;
  eventUpdates: boolean;
  communityActivity: boolean;
  nearbyEvents: boolean;

  failedPaymentAlerts: boolean;
  newKycSubmission: boolean;
  reportedContent: boolean;
  highTrafficWarning: boolean;
  adminEmailRecipients: string[];
}

interface SecurityState {
  twoFactorAuthentication: boolean[];
  sessionTimeout: number;
  maxLoginAttempts: number;
  accountLockoutDuration: number;
  pwdMinLength: number;
  requireSpecialCharx: boolean;
  requireUppercaseLetters: boolean;

  dataEncryption: string;
  sslCertificate: string;
  autoDataBackup: boolean;
  backupFrequency: string;
  dataRetentionPeriod: number;

  ipWhitelisting: boolean;
  whiteListedIPs: string[];
  suspiciousActivityDetection: boolean;

  gdprComplianceMode: boolean;
  cookieConsentBanner: boolean;
  userDataExport: boolean;
  rightToDeletion: boolean;
}


interface WhitelistedIPsProps {
  ips: string[];
  onChange: (emails: string[]) => void;
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

interface SelectField2FA {
  id: string;
  checked: boolean[];
  onChange: (value: number) => void;
  options: string[];
}

interface PanelProps {
  title: string;
  children: React.ReactNode;
}

interface EmailRecipientProps {
  emails: string[];
  onChange: (emails: string[]) => void;
}

// payment settings
interface PaymentGatewayState {
  primaryGateway: string;
  testMode: boolean;
  paystackPublicKey: string;
  paystackSecretKey: string;
  webhookUrl: string;
}

interface CurrencyPricingState {
  defaultCurrency: string;
  supportedCurrencies: string[];
  minimumTransactionAmount: number;
  maximumTransactionAmount: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  badge?: string;
  featured?: boolean;
  features: string[];
}

interface PayoutSettingsState {
  eventCreatorPayoutPct: number;
  platformCommissionPct: number;
  payoutSchedule: string;
  minimumPayoutAmount: number;
  autoPayout: boolean;
}

interface RefundPolicyState {
  allowRefunds: boolean;
  refundWindowHours: number;
  autoApproveRefundsUnder: number;
  requireAdminApproval: boolean;
}

interface PrefixedNumberFieldProps {
  id: string;
  prefix: string;
  value: number;
  onChange: (value: number) => void;
}

interface CopyFieldProps {
  id: string;
  value: string;
}

interface CurrencyChipsProps {
  currencies: string[];
  onChange: (currencies: string[]) => void;
}

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSave: (plan: SubscriptionPlan) => void;
  onRemove: () => void;
}
