import type {
  APIApplicationCommandAutocompleteResponse,
  APICommandAutocompleteInteractionResponseCallbackData,
} from "@discordjs/core";

import {
  type APIInteractionResponseCallbackData,
  type APIInteractionResponseChannelMessageWithSource,
  type APIInteractionResponseUpdateMessage,
  type APIModalInteractionResponse,
  type APIModalInteractionResponseCallbackData,
  InteractionResponseType,
} from "@discordjs/core";

export const reply = (data: APIInteractionResponseCallbackData) =>
  Response.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data,
  } satisfies APIInteractionResponseChannelMessageWithSource);

export type JSONReply = ReturnType<typeof reply>;

export const modalReply = (data: APIModalInteractionResponseCallbackData) =>
  Response.json({
    type: InteractionResponseType.Modal,
    data,
  } satisfies APIModalInteractionResponse);

// type JSONModalReply = ReturnType<typeof modalReply>;

export const updateMessage = (data: APIInteractionResponseCallbackData) =>
  Response.json({
    type: InteractionResponseType.UpdateMessage,
    data,
  } satisfies APIInteractionResponseUpdateMessage);

// type JSONUpdateMessage = ReturnType<typeof updateMessage>;

// export type JSONUpdateMessage = ReturnType<typeof updateMessage>;

export const autocompleteReply = (
  data: APICommandAutocompleteInteractionResponseCallbackData,
) =>
  Response.json({
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data,
  } satisfies APIApplicationCommandAutocompleteResponse);

// export type JSONAutocompleteReply = ReturnType<typeof autocompleteReply>;
