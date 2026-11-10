import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { TenancyMiddleware } from "./core/tenancy/tenancy.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: process.env.PUBLIC_WEB_ORIGIN || "*", credentials: true } });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const tenancy = app.get(TenancyMiddleware);
  app.use(tenancy.use.bind(tenancy));
  const port = Number(process.env.PORT || 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`College Sathi API on :${port}/api  (${process.env.DATABASE_URL ? "postgres" : "in-memory demo"} mode)`);
}

bootstrap();
