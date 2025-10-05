import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { Country } from './travel/country/country.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const countryRepository = app.get<Repository<Country>>(getRepositoryToken(Country));
  const countries = [
    { name: 'Argentina' },
    { name: 'Australia' },
    { name: 'Austria' },
    { name: 'Belgium' },
    { name: 'Brazil' },
    { name: 'Cambodia' },
    { name: 'Canada' },
    { name: 'Chile' },
    { name: 'China' },
    { name: 'Colombia' },
    { name: 'Costa Rica' },
    { name: 'Croatia' },
    { name: 'Cuba' },
    { name: 'Czech Republic' },
    { name: 'Denmark' },
    { name: 'Ecuador' },
    { name: 'Egypt' },
    { name: 'Estonia' },
    { name: 'Ethiopia' },
    { name: 'Fiji' },
    { name: 'Finland' },
    { name: 'France' },
    { name: 'Germany' },
    { name: 'Greece' },
    { name: 'Hungary' },
    { name: 'Iceland' },
    { name: 'India' },
    { name: 'Indonesia' },
    { name: 'Ireland' },
    { name: 'Israel' },
    { name: 'Italy' },
    { name: 'Jamaica' },
    { name: 'Japan' },
    { name: 'Jordan' },
    { name: 'Kenya' },
    { name: 'Laos' },
    { name: 'Latvia' },
    { name: 'Lithuania' },
    { name: 'Luxembourg' },
    { name: 'Malaysia' },
    { name: 'Maldives' },
    { name: 'Malta' },
    { name: 'Mexico' },
    { name: 'Monaco' },
    { name: 'Mongolia' },
    { name: 'Morocco' },
    { name: 'Myanmar' },
    { name: 'Nepal' },
    { name: 'Netherlands' },
    { name: 'New Zealand' },
    { name: 'Norway' },
    { name: 'Peru' },
    { name: 'Philippines' },
    { name: 'Poland' },
    { name: 'Portugal' },
    { name: 'Romania' },
    { name: 'Russia' },
    { name: 'Singapore' },
    { name: 'South Africa' },
    { name: 'South Korea' },
    { name: 'Spain' },
    { name: 'Sri Lanka' },
    { name: 'Sweden' },
    { name: 'Switzerland' },
    { name: 'Taiwan' },
    { name: 'Tanzania' },
    { name: 'Thailand' },
    { name: 'Turkey' },
    { name: 'United Arab Emirates' },
    { name: 'United Kingdom' },
    { name: 'United States' },
    { name: 'Vietnam' },
  ].map(c => ({ name: c.name, id: undefined })); // Ensure id is not set
  await countryRepository.save(countries).catch(err => {
    // Ignore unique constraint errors if countries already exist
    if (err.code !== '23505') {
      console.error('Error seeding countries:', err);
    }
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(3000);
}
bootstrap();