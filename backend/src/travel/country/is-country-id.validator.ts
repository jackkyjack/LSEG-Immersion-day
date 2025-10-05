import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsCountryIdConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async validate(countryId: any, args: ValidationArguments) {
    if (typeof countryId !== 'number' || !Number.isInteger(countryId)) {
      return false;
    }
    const country = await this.countryRepository.findOne({ where: { id: countryId } });
    return !!country;
  }

  defaultMessage(args: ValidationArguments) {
    return `Country with id "${args.value}" does not exist.`;
  }
}

export function IsCountryId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCountryIdConstraint,
    });
  };
}