import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';

// Validador para identificar se senha = confirmarSenha
@ValidatorConstraint({ name: 'Match', async: false })
export class Match implements ValidatorConstraintInterface {

  
  validate(value: any, args: ValidationArguments): boolean {
    const [propertyToMatch] = args.constraints;
    const valueToMatch = (args.object as any)[propertyToMatch]; 
    return value === valueToMatch;
  }

  // Mensagem de erro
  defaultMessage(args: ValidationArguments): string {
    const [propertyToMatch] = args.constraints;
    return `O valor de ${args.property} deve ser igual ao campo ${propertyToMatch}`;
  }
}
