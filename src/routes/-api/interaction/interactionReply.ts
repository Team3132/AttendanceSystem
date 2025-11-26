import {
  type APIApplicationCommandAutocompleteResponse,
  type APICommandAutocompleteInteractionResponseCallbackData,
  type APIInteractionResponseCallbackData,
  type APIInteractionResponseChannelMessageWithSource,
  type APIInteractionResponseUpdateMessage,
  type APIModalInteractionResponse,
  type APIModalInteractionResponseCallbackData,
  InteractionResponseType,
} from "@discordjs/core";
import type { Context } from "hono";

export const reply = (c: Context, data: APIInteractionResponseCallbackData) =>
  c.json<APIInteractionResponseChannelMessageWithSource>({
    type: InteractionResponseType.ChannelMessageWithSource,
    data,
  });

export type JSONReply = ReturnType<typeof reply>;

export const modalReply = (
  c: Context,
  data: APIModalInteractionResponseCallbackData,
) =>
  c.json<APIModalInteractionResponse>({
    type: InteractionResponseType.Modal,
    data,
  });

// export type JSONModalReply = ReturnType<typeof modalReply>;

export const updateMessage = (
  c: Context,
  data: APIInteractionResponseCallbackData,
) =>
  c.json<APIInteractionResponseUpdateMessage>({
    type: InteractionResponseType.UpdateMessage,
    data,
  });

// export type JSONUpdateMessage = ReturnType<typeof updateMessage>;

export const autocompleteReply = (
  c: Context,
  data: APICommandAutocompleteInteractionResponseCallbackData,
) =>
  c.json<APIApplicationCommandAutocompleteResponse>({
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data,
  });

// export type JSONAutocompleteReply = ReturnType<typeof autocompleteReply>;
