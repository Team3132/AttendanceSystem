import {
  type APIInteractionResponseCallbackData,
  type APIInteractionResponseChannelMessageWithSource,
  type APIInteractionResponseUpdateMessage,
  type APIModalInteractionResponse,
  type APIModalInteractionResponseCallbackData,
  InteractionResponseType,
} from "@discordjs/core";
import { json } from "@tanstack/react-start";

export const reply = (data: APIInteractionResponseCallbackData) =>
  json<APIInteractionResponseChannelMessageWithSource>({
    type: InteractionResponseType.ChannelMessageWithSource,
    data,
  });

export type JSONReply = ReturnType<typeof reply>;

export const modalReply = (data: APIModalInteractionResponseCallbackData) =>
  json<APIModalInteractionResponse>({
    type: InteractionResponseType.Modal,
    data,
  });

export type JSONModalReply = ReturnType<typeof modalReply>;

export const updateMessage = (data: APIInteractionResponseCallbackData) =>
  json<APIInteractionResponseUpdateMessage>({
    type: InteractionResponseType.UpdateMessage,
    data,
  });

export type JSONUpdateMessage = ReturnType<typeof updateMessage>;
