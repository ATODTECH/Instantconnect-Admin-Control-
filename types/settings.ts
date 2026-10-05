type TabId =
  | "general"
  | "notifications"
  | "security"
  | "payment"
  | "content-moderation"

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
  /** Shown but disabled: the platform does not act on this setting yet. */
  locked?: boolean;
}

interface TextFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
