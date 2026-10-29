export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'multiline'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormFieldConfig {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
}

export interface FormConfig {
  title: string;
  description: string;
  fields: FormFieldConfig[];
}

export type FormValues = Record<
  string,
  string | boolean
>;

export interface FormSubmission {
  id: string;
  submittedAt: string;
  values: FormValues;
}