import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Prisma } from '@prisma/client';

const validKeys: (keyof Prisma.BeerOrderByWithRelationInput)[] = [
  'id',
  'name',
  'description',
];

export function IsValidOrderBy(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidOrderBy',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'object' || value === null) {
            return false;
          }

          for (const key in value) {
            if (!validKeys.includes(key as any)) {
              return false;
            }
            if (value[key] !== 'asc' && value[key] !== 'desc') {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must have values 'asc' or 'desc' only`;
        },
      },
    });
  };
}
