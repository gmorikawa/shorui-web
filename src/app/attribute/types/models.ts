export type AttributeKey = string;
export type Label = string;

export type NewAttribute = Attribute;

export interface Attribute {
  key: AttributeKey;
  label: Label;
  description?: string;
}
