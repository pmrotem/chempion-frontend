export interface Validator {
  msgItem: {type: string, msg: string};
  validate(newValue: string) : boolean;
}

export class RequiredValidator implements  Validator{
  msgItem: {type: string, msg: string} = {type: 'error', msg: 'field is required'};
  constructor(){}

  validate(newValue: string): boolean {
    return newValue.trim() !== '';
  }
}
