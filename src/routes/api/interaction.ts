import env from "@/server/env";
import { generateMessage } from "@/server/services/botService";
import { syncEvents } from "@/server/services/calalendarSync.service";
import { trytm } from "@/utils/trytm";
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  type ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "@discordjs/builders";
import {
  type APIApplicationCommandInteractionDataStringOption,
  type APIInteraction,
  type APIInteractionResponseCallbackData,
  type APIInteractionResponseChannelMessageWithSource,
  type APIInteractionResponsePong,
  type APIInteractionResponseUpdateMessage,
  type APIModalInteractionResponse,
  type APIModalInteractionResponseCallbackData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  TextInputStyle,
} from "@discordjs/core";
import { json } from "@tanstack/react-start";
import {
  createServerFileRoute,
  getHeader,
  readRawBody,
} from "@tanstack/react-start/server";
import { match } from "path-to-regexp";

import {
  type LeaderBoardUser,
  RSVPStatusUpdateSchema,
  type RSVPUserSchema,
} from "@/server";
import db from "@/server/drizzle/db";
import {
  editUserRsvpStatus,
  getAutocompleteEvents,
  getEvent,
  getEventRsvps,
  getEventSecret,
  markEventPosted,
  selfCheckin,
  userCheckout,
} from "@/server/services/events.service";
import { getOutreachTime } from "@/server/services/outreach.service";
import { createUser } from "@/server/services/user.service";
import { verifyKey } from "discord-interactions";
import { DateTime, Duration } from "luxon";
import { z } from "zod";

const reply = (data: APIInteractionResponseCallbackData) =>
  json<APIInteractionResponseChannelMessageWithSource>({
    type: InteractionResponseType.ChannelMessageWithSource,
    data,
  });

const modalReply = (data: APIModalInteractionResponseCallbackData) =>
  json<APIModalInteractionResponse>({
    type: InteractionResponseType.Modal,
    data,
  });

const updateMessage = (data: APIInteractionResponseCallbackData) =>
  json<APIInteractionResponseUpdateMessage>({
    type: InteractionResponseType.UpdateMessage,
    data,
  });

export const statusToEmoji = (
  status: z.infer<typeof RSVPUserSchema>["status"],
) => {
  switch (status) {
    case "YES":
      return ":white_check_mark:";
    case "NO":
      return ":x:";
    case "MAYBE":
      return ":grey_question:";
    case "LATE":
      return ":clock3:";
    case "ATTENDED":
      return ":ok:";
    default:
      return "";
  }
};

export default function rsvpToDescription(
  username: string,
  status: z.infer<typeof RSVPUserSchema>["status"],
) {
  return `${username} - ${statusToEmoji(status)}`;
}

export const ServerRoute = createServerFileRoute().methods({
  POST: async ({ request }) => {
    const signature = getHeader("X-Signature-Ed25519");
    const timestamp = getHeader("X-Signature-Timestamp");

    console.log(
      `Received interaction with signature: ${signature}, timestamp: ${timestamp}`,
    );

    const rawBody = await readRawBody();

    if (!signature || !timestamp || !rawBody) {
      console.error("Missing signature, timestamp, or raw body");
      return json({ message: "Invalid request" }, { status: 401 });
    }

    const isValidRequest = await verifyKey(
      rawBody,
      signature,
      timestamp,
      env.VITE_DISCORD_PUBLIC_KEY,
    );

    console.log(`Request validation result: ${isValidRequest}`);

    if (!isValidRequest) {
      return new Response("Bad request signature", {
        status: 401,
      });
    }

    const interaction: APIInteraction = await request.json();

    if (interaction.type === InteractionType.Ping) {
      console.log("Received ping interaction");
      return json<APIInteractionResponsePong>({
        type: InteractionResponseType.Pong,
      });
    }

    if (
      interaction.member === undefined ||
      interaction.guild_id !== env.VITE_GUILD_ID
    ) {
      console.log(
        "Interaction is not from a guild member or guild ID does not match",
      );
      return reply({
        content: "You must be a guild member to use this command.",
        flags: MessageFlags.Ephemeral,
      });
    }

    /**
     * Handle application command interactions.
     */
    if (interaction.type === InteractionType.ApplicationCommand) {
      /**
       * Respond to typical slash commands
       */
      if (interaction.data.type === ApplicationCommandType.ChatInput) {
        console.log(`Processing chat input command: ${interaction.data.name}`);
        /**
         * Respond to the "ping" command with "Pong!".
         */
        if (interaction.data.name === "ping") {
          return reply({
            content: "Pong!",
          });
        }

        /**
         * Sync Please command.
         */
        if (interaction.data.name === "syncplz") {
          const [response, err] = await trytm(syncEvents());

          if (err) {
            return reply({
              content: "Failed to sync calendar.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const embed = new EmbedBuilder()
            .setColor([0, 255, 0])
            .setTitle("Calendar Synced")
            .setDescription("Calendar synced successfully")
            .setFields([
              {
                name: "Deleted Events",
                value: response.deletedEventCount.toString(),
                inline: true,
              },
              {
                name: "Updated/Created Events",
                value: response.updatedEvents.toString(),
                inline: true,
              },
            ]);

          return reply({
            content: "Calendar synced",
            embeds: [embed.toJSON()],
          });
        }

        /**
         * Request RSVP command.
         */
        if (interaction.data.name === "requestrsvp") {
          const meetingStringOption = interaction.data.options?.find(
            (option) =>
              option.type === ApplicationCommandOptionType.String &&
              option.name === "meeting",
          ) as APIApplicationCommandInteractionDataStringOption | undefined;

          const meetingId = meetingStringOption?.value;

          if (!meetingId) {
            return reply({
              content: "Please provide a meeting ID.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const [response, err] = await trytm(
            generateMessage({
              eventId: meetingId,
            }),
          );

          const [_, eventPostedError] = await trytm(markEventPosted(meetingId));

          if (eventPostedError) {
            console.error(
              `Error marking event as posted: ${eventPostedError.message}`,
            );
            return reply({
              content: "Failed to mark event as posted.",
              flags: MessageFlags.Ephemeral,
            });
          }

          if (err) {
            return reply({
              content: "Failed to generate RSVP message.",
              flags: MessageFlags.Ephemeral,
            });
          }

          return reply({
            content: response.content,
            embeds: response.embeds,
            components: response.components,
          });
        }

        /**
         * Outreach Leaderboard command.
         */
        if (interaction.data.name === "leaderboard") {
          const [leaderboardPageEmbed, leaderboardPageError] = await trytm(
            createOutreachEmbedPage(1),
          );

          if (leaderboardPageError) {
            console.error(
              `Error creating outreach embed page: ${leaderboardPageError.message}`,
            );
            return reply({
              content: "Failed to fetch leaderboard page.",
              flags: MessageFlags.Ephemeral,
            });
          }
          return reply({
            embeds: [leaderboardPageEmbed.embed.toJSON()],
            components: [leaderboardPageEmbed.messageComponent.toJSON()],
          });
        }
      }
    }

    /**
     * Handle message component interactions.
     */
    if (interaction.type === InteractionType.MessageComponent) {
      /**
       * Handle button interactions.
       */
      if (interaction.data.component_type === ComponentType.Button) {
        console.log(
          `Processing button interaction with custom ID: ${interaction.data.custom_id}`,
        );
        const { custom_id: customId } = interaction.data;

        /**
         * RSVPs button.
         */
        const rsvpsFn = match("event/:eventId/rsvps");
        const rsvpsButtonMatch = rsvpsFn(customId);

        if (rsvpsButtonMatch !== false) {
          const paramObject = await z
            .object({
              eventId: z.string(),
            })
            .safeParseAsync(rsvpsButtonMatch.params);

          if (!paramObject.success) {
            return reply({
              content: "Invalid RSVP status.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const { eventId } = paramObject.data;

          const [rsvpEvent, eventErr] = await trytm(getEvent(eventId));

          if (eventErr) {
            return reply({
              content: "Failed to fetch event details.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const [eventRsvps, rsvpsErr] = await trytm(getEventRsvps(eventId));

          if (rsvpsErr) {
            return reply({
              content: "Failed to fetch event RSVPs.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const description = eventRsvps
            .map((rsvp) => rsvpToDescription(rsvp.user.username, rsvp.status))
            .join("\n");

          const rsvpEmbed = new EmbedBuilder()
            .setTitle(
              `RSVPs for ${rsvpEvent.title} at ${DateTime.fromJSDate(
                rsvpEvent.startDate,
              ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
            )
            .setDescription(description)
            .setTimestamp(new Date())
            .setURL(`${env.VITE_FRONTEND_URL}/event/${rsvpEvent.id}`);

          return reply({
            flags: MessageFlags.Ephemeral,
            embeds: [rsvpEmbed.toJSON()],
          });
        }

        /**
         * RSVP button.
         */
        const rsvpFn = match("event/:eventId/rsvp/:rsvpStatus");

        const rsvpButtonMatch = rsvpFn(customId);
        if (rsvpButtonMatch !== false) {
          const paramObject = await z
            .object({
              eventId: z.string(),
              rsvpStatus: RSVPStatusUpdateSchema,
            })
            .safeParseAsync(rsvpButtonMatch.params);

          if (!paramObject.success) {
            return reply({
              content: "Invalid RSVP status.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const { eventId, rsvpStatus } = paramObject.data;

          const [fetchedEvent, fetchedEventErr] = await trytm(
            getEvent(eventId),
          );

          if (fetchedEventErr || !fetchedEvent) {
            return reply({
              content: "Failed to fetch event details.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const { member } = interaction;

          if (!member) {
            return reply({
              content: "You must be a guild member to RSVP.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const { roles, user, nick } = member;

          const username = nick ?? user.username;

          const [_userUpsert, userUpsertErr] = await trytm(
            createUser({
              id: user.id,
              username,
              roles,
            }),
          );

          if (userUpsertErr) {
            return reply({
              content: "Failed to create user.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const { ruleId } = fetchedEvent;

          if (ruleId !== null) {
            const [rule, ruleGetError] = await trytm(
              db.query.eventParsingRuleTable.findFirst({
                where: (table, { eq }) => eq(table.id, ruleId),
              }),
            );

            if (ruleGetError || !rule) {
              return reply({
                content: "Failed to fetch event parsing rules.",
                flags: MessageFlags.Ephemeral,
              });
            }

            const { roleIds: ruleRoles } = rule;

            roles.push(env.VITE_GUILD_ID);

            // if there's no overlap between the user's roles and the rule roles, return an error
            const hasRole = roles.some((role) => ruleRoles.includes(role));

            if (!hasRole && ruleRoles.length > 0) {
              return reply({
                content: "You do not have permission to RSVP to this event.",
                flags: MessageFlags.Ephemeral,
              });
            }
          }

          if (rsvpStatus === "LATE") {
            const delayModal = new ModalBuilder()
              .setTitle("Delay")
              .setCustomId(`event/${eventId}/delay`)
              .setComponents([
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                  [
                    new TextInputBuilder()
                      .setCustomId("delay")
                      .setPlaceholder("Delay")
                      .setLabel("Delay (in minutes)")
                      .setStyle(TextInputStyle.Short),
                  ],
                ),
              ]);

            return modalReply(delayModal.toJSON());
          }

          const [_, err] = await trytm(
            editUserRsvpStatus(user.id, {
              eventId,
              status: rsvpStatus,
            }),
          );

          if (err) {
            return reply({
              content: "Failed to update RSVP status.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const [generatedMessage, genMsgErr] = await trytm(
            generateMessage({
              eventId,
            }),
          );

          if (genMsgErr) {
            return reply({
              content: "Failed to generate RSVP message.",
              flags: MessageFlags.Ephemeral,
            });
          }

          return updateMessage({
            content: generatedMessage.content,
            embeds: generatedMessage.embeds,
            components: generatedMessage.components,
          });
        }

        /**
         * Check-in button.
         */
        const checkinFn = match("event/:eventId/checkin");
        const checkinButtonMatch = checkinFn(customId);
        if (checkinButtonMatch !== false) {
          const paramObject = await z
            .object({
              eventId: z.string(),
            })
            .safeParseAsync(checkinButtonMatch.params);
          if (!paramObject.success) {
            return reply({
              content: "Invalid event ID.",
              flags: MessageFlags.Ephemeral,
            });
          }
          const { eventId } = paramObject.data;

          const checkinModal = new ModalBuilder()
            .setTitle("Checkin")
            .setCustomId(`event/${eventId}/checkin`)
            .setComponents([
              new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                [
                  new TextInputBuilder()
                    .setCustomId("code")
                    .setPlaceholder("8 digit code")
                    .setRequired(true)
                    .setMinLength(8)
                    .setMaxLength(8)
                    .setLabel("The event code")
                    .setStyle(TextInputStyle.Short),
                ],
              ),
            ]);

          return modalReply(checkinModal.toJSON());
        }

        /**
         * Check out button.
         */
        const checkoutFn = match("event/:eventId/checkout");
        const checkoutButtonMatch = checkoutFn(customId);
        if (checkoutButtonMatch !== false) {
          const paramObject = await z
            .object({
              eventId: z.string(),
            })
            .safeParseAsync(checkoutButtonMatch.params);

          if (!paramObject.success) {
            return reply({
              content: "Invalid event ID.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const { eventId } = paramObject.data;

          const { member } = interaction;

          if (!member) {
            return reply({
              content: "You must be a guild member to check out.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const [_, checkoutErr] = await trytm(
            userCheckout(member.user.id, eventId),
          );

          if (checkoutErr) {
            return reply({
              content: "Failed to check out.",
              flags: MessageFlags.Ephemeral,
            });
          }
          const [generatedMessage, genMsgErr] = await trytm(
            generateMessage({
              eventId,
            }),
          );
          if (genMsgErr) {
            return reply({
              content: "Failed to generate RSVP message.",
              flags: MessageFlags.Ephemeral,
            });
          }
          return updateMessage({
            content: generatedMessage.content,
            embeds: generatedMessage.embeds,
            components: generatedMessage.components,
          });
        }

        /**
         * Leaderboard Page Button.
         */
        const leaderboardPageFn = match("leaderboard/:toPage/:random");
        const initialLeaderboardMatch = leaderboardPageFn(customId);
        if (initialLeaderboardMatch !== false) {
          const paramObject = await z
            .object({
              toPage: z.coerce.number().int().min(1),
            })
            .safeParseAsync(initialLeaderboardMatch.params);

          if (!paramObject.success) {
            return reply({
              content: "Invalid page number.",
              flags: MessageFlags.Ephemeral,
            });
          }

          const { toPage } = paramObject.data;

          const [leaderboardPageEmbed, leaderboardPageError] = await trytm(
            createOutreachEmbedPage(toPage),
          );
          if (leaderboardPageError) {
            console.error(
              `Error creating outreach embed page: ${leaderboardPageError.message}`,
            );
            return reply({
              content: "Failed to fetch leaderboard page.",
              flags: MessageFlags.Ephemeral,
            });
          }

          return updateMessage({
            embeds: [leaderboardPageEmbed.embed.toJSON()],
            components: [leaderboardPageEmbed.messageComponent.toJSON()],
          });
        }
      }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      console.log(
        `Processing modal submit interaction with custom ID: ${interaction.data.custom_id}`,
      );
      const { custom_id: customId } = interaction.data;

      /**
       * Late RSVP modal.
       * This modal is triggered when a user clicks the "Late" button in the RSVP message.
       */
      const delayFn = match("event/:eventId/delay");
      const delayMatch = delayFn(customId);
      if (delayMatch !== false) {
        const paramObject = await z
          .object({
            eventId: z.string(),
          })
          .safeParseAsync(delayMatch.params);

        if (!paramObject.success) {
          return reply({
            content: "Invalid event ID.",
            flags: MessageFlags.Ephemeral,
          });
        }

        const { eventId } = paramObject.data;

        const delay = interaction.data.components
          .flatMap((componentRow) => componentRow.components)
          .find(
            (component) =>
              component.type === ComponentType.TextInput &&
              component.custom_id === "delay",
          )?.value;

        const parsedValueSchema = await z.coerce
          .number()
          .int()
          .min(0, "Delay must be a positive number")
          .safeParseAsync(delay);

        if (!parsedValueSchema.success) {
          return reply({
            content: parsedValueSchema.error.flatten().formErrors.join(", "),
            flags: MessageFlags.Ephemeral,
          });
        }

        const { data: value } = parsedValueSchema;

        const [eventData, eventDataError] = await trytm(getEvent(eventId));

        if (eventDataError || !eventData) {
          return reply({
            content: "Failed to fetch event details.",
            flags: MessageFlags.Ephemeral,
          });
        }

        const startDateTime = DateTime.fromJSDate(eventData.startDate);

        const { member } = interaction;
        if (!member) {
          return reply({
            content: "You must be a guild member to RSVP.",
            flags: MessageFlags.Ephemeral,
          });
        }
        const { user } = member;

        const arrivingAt =
          startDateTime.plus({ minutes: value }).toJSDate() ?? undefined;

        const [_updatedRsvp, updateRsvpError] = await trytm(
          editUserRsvpStatus(user.id, {
            eventId,
            status: "LATE",
            arrivingAt,
          }),
        );

        if (updateRsvpError) {
          return reply({
            content: "Failed to update RSVP status.",
            flags: MessageFlags.Ephemeral,
          });
        }
        const [generatedMessage, genMsgErr] = await trytm(
          generateMessage({
            eventId,
          }),
        );
        if (genMsgErr) {
          return reply({
            content: "Failed to generate RSVP message.",
            flags: MessageFlags.Ephemeral,
          });
        }
        return updateMessage({
          content: generatedMessage.content,
          embeds: generatedMessage.embeds,
          components: generatedMessage.components,
        });
      }

      /**
       * Self check-in modal.
       * This modal is triggered when a user clicks the "Check In" button in the RSVP message.
       */
      const checkinFn = match("event/:eventId/checkin");
      const checkinMatch = checkinFn(customId);
      if (checkinMatch !== false) {
        const code = interaction.data.components
          .flatMap((componentRow) => componentRow.components)
          .find(
            (component) =>
              component.type === ComponentType.TextInput &&
              component.custom_id === "code",
          )?.value;

        const paramObject = await z
          .object({
            eventId: z.string(),
          })
          .safeParseAsync(checkinMatch.params);

        if (!paramObject.success) {
          return reply({
            content: "Invalid event ID.",
            flags: MessageFlags.Ephemeral,
          });
        }
        const { eventId } = paramObject.data;

        const [secret, secretErr] = await trytm(getEventSecret(eventId));

        if (secretErr || !secret) {
          return reply({
            content: "Failed to fetch event secret.",
            flags: MessageFlags.Ephemeral,
          });
        }

        if (secret.secret !== code) {
          return reply({
            content: "Invalid code.",
            flags: MessageFlags.Ephemeral,
          });
        }

        const { member } = interaction;

        if (!member) {
          return reply({
            content: "You must be a guild member to check in.",
            flags: MessageFlags.Ephemeral,
          });
        }
        const { roles, user, nick } = member;
        const username = nick ?? user.username;
        const [_userUpsert, userUpsertErr] = await trytm(
          createUser({
            id: user.id,
            username,
            roles,
          }),
        );
        if (userUpsertErr) {
          return reply({
            content: "Failed to create user.",
            flags: MessageFlags.Ephemeral,
          });
        }
        const [_checkinResponse, checkinErr] = await trytm(
          selfCheckin(user.id, {
            eventId,
            secret: secret.secret,
          }),
        );
        if (checkinErr) {
          return reply({
            content: "Failed to check in.",
            flags: MessageFlags.Ephemeral,
          });
        }
        const [generatedMessage, genMsgErr] = await trytm(
          generateMessage({
            eventId,
          }),
        );
        if (genMsgErr) {
          return reply({
            content: "Failed to generate RSVP message.",
            flags: MessageFlags.Ephemeral,
          });
        }
        return updateMessage({
          content: generatedMessage.content,
          embeds: generatedMessage.embeds,
          components: generatedMessage.components,
        });
      }
    }

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      console.log(
        `Processing autocomplete interaction for command: ${interaction.data.name}`,
      );
      if (interaction.data.name === "requestrsvp") {
        const meetingStringOption = interaction.data.options?.find(
          (option) =>
            option.type === ApplicationCommandOptionType.String &&
            option.name === "meeting",
        ) as APIApplicationCommandInteractionDataStringOption | undefined;

        if (!meetingStringOption) {
          return json({
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: { choices: [] },
          });
        }

        const query = meetingStringOption.value.toLowerCase();

        const [events, err] = await trytm(getAutocompleteEvents(query));

        if (err) {
          return json({
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: { choices: [] },
          });
        }

        const choices = events.map((event) => ({
          name: event.title,
          value: event.id,
        }));

        return json({
          type: InteractionResponseType.ApplicationCommandAutocompleteResult,
          data: { choices },
        });
      }
    }
  },
});

const roundDuration = (duration: Duration) => {
  const millis = duration.toMillis();
  // round to the nearest minute
  const rounded = Math.round(millis / 60000) * 60000;
  const hours = Math.floor(rounded / 3600000);
  const minutes = Math.floor((rounded % 3600000) / 60000);
  return Duration.fromObject({ hours, minutes });
};

const leaderboardLine = (data: z.infer<typeof LeaderBoardUser>) =>
  `${data.rank}. **${data.username}** - ${roundDuration(
    Duration.fromISO(data.duration),
  ).toHuman()}`;

function randomStr(length = 8): string {
  const alphanumericCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(
      Math.random() * alphanumericCharacters.length,
    );
    result += alphanumericCharacters[randomIndex];
  }

  return result;
}

const createOutreachEmbedPage = async (page: number) => {
  const perPage = 10;

  const [leaderboardResponse, leaderboardError] = await trytm(
    getOutreachTime({
      cursor: page - 1,
      limit: perPage,
    }),
  );

  if (leaderboardError) {
    throw new Error(
      `Error fetching outreach leaderboard: ${leaderboardError.message}`,
    );
  }

  const { items: leaderBoardData, total } = leaderboardResponse;

  // pages start at 1
  const maxPage = Math.ceil(total / perPage);

  if (maxPage === 0) {
    throw new Error("No data available for the leaderboard");
  }

  if (page > maxPage || page < 1) throw new Error("Invalid page");

  const embed = new EmbedBuilder()
    .setTitle(`Outreach Leaderboard ${page}/${maxPage}`)
    .setTimestamp(new Date());

  const lines = leaderBoardData.map(leaderboardLine).join("\n");

  embed.setDescription(lines);

  const messageComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`leaderboard/${1}/${randomStr(4)}`)
      .setLabel("First")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`leaderboard/${page - 1}/${randomStr(4)}`)
      .setLabel("Previous")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`leaderboard/${page}/${randomStr(4)}`)
      .setLabel("Refresh")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(false),
    new ButtonBuilder()
      .setCustomId(`leaderboard/${page + 1}/${randomStr(4)}`)
      .setLabel("Next")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === maxPage),
    new ButtonBuilder()
      .setCustomId(`leaderboard/${maxPage}/${randomStr(4)}`)
      .setLabel("Last")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === maxPage),
  );

  return { embed, messageComponent };
};
