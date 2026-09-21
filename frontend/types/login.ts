type AdminRole = "admin" | "master admin";

interface FormValues {
  role: AdminRole | "";
  username: string;
  password: string;
}

type FieldName = keyof FormValues;
type Errors = Partial<Record<FieldName, string>>;
type Touched = Partial<Record<FieldName, boolean>>;

interface res {
  data: string,
  status: number,
}
