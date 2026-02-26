// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors({ origin: 'http://localhost:4444' });
//   await app.listen(5555);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS للـ Frontend بعد ما ترفعه، مؤقتًا true أثناء التطوير
  app.enableCors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  });

  // Port من البيئة أو 3000
  const port = process.env.PORT || 5555;
  await app.listen(port);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  console.log(`🚀 Backend running on port ${port}`);
}
bootstrap();
