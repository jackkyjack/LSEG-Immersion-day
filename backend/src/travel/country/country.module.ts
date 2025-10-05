import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { IsCountryIdConstraint } from './is-country-id.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountryService, IsCountryIdConstraint],
  controllers: [CountryController],
  exports: [TypeOrmModule, IsCountryIdConstraint],
})
export class CountryModule {}