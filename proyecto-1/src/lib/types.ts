// Auth types 
export interface Register {
  username: string
}

export enum FormFieldType {
  INPUT = "input",
  NUMBER = "number",
  FILE = "file",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE = "date",
  SELECT = "select",
  SELECT_ITEM = "selectItem",
  SKELETON = "skeleton",
}