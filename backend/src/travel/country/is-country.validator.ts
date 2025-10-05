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
export class IsCountryConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async validate(countryName: any, args: ValidationArguments) {
    if (typeof countryName !== 'string') {
      return false;
    }
    const country = await this.countryRepository.findOne({
      where: { name: countryName },
    });
    return !!country;
  }

  defaultMessage(args: ValidationArguments) {
    return `Country "${args.value}" does not exist.`;
  }
}

export function IsCountry(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCountryConstraint,
    });
  };
}