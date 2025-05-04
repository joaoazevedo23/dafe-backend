import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments,} from 'class-validator';
  
  @ValidatorConstraint({ name: 'Match', async: false })
  export class Match implements ValidatorConstraintInterface {
  
    validate(value: any, args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      const relatedValue = (args.object as any)[relatedPropertyName];
      return value === relatedValue;
    }
  
    defaultMessage(args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      return `O valor de ${args.property} deve ser igual a ${relatedPropertyName}`;
    }
  }
  