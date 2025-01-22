import { BACKEND_TOKEN, BackendClient } from "@/backend/backend.module";
import { ROLES } from "@/constants";
import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GuildMember } from "discord.js";
import { NecordExecutionContext } from "necord";

@Injectable()
export class MentorGuard implements CanActivate {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const logger = new Logger(MentorGuard.name);
    try {
      const [interaction] =
        NecordExecutionContext.create(
          context,
        ).getContext<"interactionCreate">();

      const approvedGuildId = this.config.getOrThrow("VITE_GUILD_ID");
      const guildId = interaction.guildId;

      if (!guildId || guildId !== approvedGuildId) return false;

      const guildMember = interaction.member;

      if (!(guildMember instanceof GuildMember)) return false;

      const fetchedUser = await guildMember.fetch();

      const userRoles = [
        ...fetchedUser.roles.cache.mapValues((role) => role.id).values(),
      ];

      const username = fetchedUser.nickname ?? fetchedUser.user.username;

      const user = await this.backendClient.client.bot.findOrCreateUser.mutate({
        id: fetchedUser.id,
        username,
        roles: userRoles,
      });

      logger.log(`User ${fetchedUser.id} (${username}) has been updated`);

      if (user.roles?.includes(ROLES.MENTOR)) return true;

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
