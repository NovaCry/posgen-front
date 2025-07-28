export type FieldType = 'string' | 'int' | 'float' | 'boolean';

export interface Field {
  type: FieldType;
  name: string;
}
