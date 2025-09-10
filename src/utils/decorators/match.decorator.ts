// src/utils/decorators/match.decorator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';


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
    // Retorna a mensagem de erro padrão se nenhuma for fornecida no DTO.
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
      constraints: [property], // Passa o nome do campo a ser comparado (ex: 'senha')
      options: validationOptions, // Passa opções como a mensagem de erro customizada
      validator: MatchConstraint, // Especifica que a classe MatchConstraint deve ser usada para a lógica
    });
  };
}