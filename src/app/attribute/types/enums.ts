export enum AttributeType {
  TEXT = 'text',
  INTEGER = 'integer',
  FLOAT = 'float',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
  MONEY_JPY = 'money_jpy',
  MONEY_USD = 'money_usd',
  MONEY_EUR = 'money_eur',
  MONEY_BRL = 'money_brl',
  SELECT = 'select'
}

export interface AttributeTypeItem {
  key: AttributeType;
  label: string;
}

export class AttributeTypeMetadata {
  public static getAll(): AttributeTypeItem[] {
    return [
      { key: AttributeType.TEXT, label: 'Text' },
      { key: AttributeType.INTEGER, label: 'Integer' },
      { key: AttributeType.FLOAT, label: 'Float' },
      { key: AttributeType.BOOLEAN, label: 'Boolean' },
      { key: AttributeType.DATE, label: 'Date' },
      { key: AttributeType.DATETIME, label: 'DateTime' },
      { key: AttributeType.TIME, label: 'Time' },
      { key: AttributeType.MONEY_JPY, label: 'Money (JPY)' },
      { key: AttributeType.MONEY_USD, label: 'Money (USD)' },
      { key: AttributeType.MONEY_EUR, label: 'Money (EUR)' },
      { key: AttributeType.MONEY_BRL, label: 'Money (BRL)' },
      { key: AttributeType.SELECT, label: 'Select' }
    ];
  }

  public static getKeys(): AttributeType[] {
    return this.getAll().map(item => item.key);
  }

  public static getLabelByKey(key: AttributeType): string {
    const item = this.getAll().find(i => i.key === key);

    if (!item) {
      console.warn(`Attribute type with key "${key}" not found.`);
    }

    return item ? item.label : '';
  }
}
