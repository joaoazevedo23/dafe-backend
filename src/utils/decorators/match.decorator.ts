import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';

// Esta classe contém a lógica de validação.
@ValidatorConstraint({ name: 'Match', async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
  
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;

    // Mensagem de erro padrão.
    return `${args.property} e ${relatedPropertyName} não são compatíveis`;
  }
}

// Função que registra a validação.
export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property], // Campo a ser comparado - senha
      options: validationOptions, // Mensagem de erro customizada
      validator: MatchConstraint, // Classe MatchConstraint deve ser usada para a comparação
    });
  };
}