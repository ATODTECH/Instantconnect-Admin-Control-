interface FormValues {
  email: string;
  password: string;
}

type FieldName = keyof FormValues;
type Errors = Partial<Record<FieldName, string>>;
type Touched = Partial<Record<FieldName, boolean>>;
