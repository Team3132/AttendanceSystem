import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    const username = config.getOrThrow('POSTGRES_USER');
    const password = config.getOrThrow('POSTGRES_PASSWORD');
    const host = config.getOrThrow('POSTGRES_HOST');
    const database = config.getOrThrow('POSTGRES_DB');

    super({
      datasources: {
        db: {
          url: `postgres://${username}:${password}@${host}:5432/${database}`,
        },
      },
    });
  }

  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to DB');
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
