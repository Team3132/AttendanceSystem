import type { GraphQLClient, RequestOptions } from 'graphql-request';
import { GraphQLError } from 'graphql'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CronWebhook = {
  __typename?: 'CronWebhook';
  cronExpression: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  nextRun?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCronWebhook: CronWebhook;
  deleteCronWebhook: Scalars['Boolean']['output'];
  triggerWebhook: Scalars['Boolean']['output'];
  updateCronWebhook: CronWebhook;
};


export type MutationCreateCronWebhookArgs = {
  cronExpression: Scalars['String']['input'];
  url: Scalars['String']['input'];
};


export type MutationDeleteCronWebhookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationTriggerWebhookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCronWebhookArgs = {
  cronExpression?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  cronWebhook?: Maybe<CronWebhook>;
  cronWebhooks: Array<CronWebhook>;
};


export type QueryCronWebhookArgs = {
  id: Scalars['ID']['input'];
};

export type CreateWebhookMutationVariables = Exact<{
  url: Scalars['String']['input'];
  cronExpression: Scalars['String']['input'];
}>;


export type CreateWebhookMutation = { __typename?: 'Mutation', createCronWebhook: { __typename?: 'CronWebhook', id: string, url: string, cronExpression: string, enabled: boolean, nextRun?: string | null } };

export type DeleteWebhookMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteWebhookMutation = { __typename?: 'Mutation', deleteCronWebhook: boolean };

export type TriggerWebhookMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TriggerWebhookMutation = { __typename?: 'Mutation', triggerWebhook: boolean };

export type UpdateWebhookMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
  cronExpression?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateWebhookMutation = { __typename?: 'Mutation', updateCronWebhook: { __typename?: 'CronWebhook', id: string, url: string, cronExpression: string, enabled: boolean, nextRun?: string | null } };

export type WebhookQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type WebhookQuery = { __typename?: 'Query', cronWebhook?: { __typename?: 'CronWebhook', id: string, url: string, cronExpression: string, enabled: boolean, nextRun?: string | null } | null };

export type WebhooksQueryVariables = Exact<{ [key: string]: never; }>;


export type WebhooksQuery = { __typename?: 'Query', cronWebhooks: Array<{ __typename?: 'CronWebhook', id: string, url: string, cronExpression: string, enabled: boolean, nextRun?: string | null }> };


export const CreateWebhookDocument = `
    mutation CreateWebhook($url: String!, $cronExpression: String!) {
  createCronWebhook(url: $url, cronExpression: $cronExpression) {
    id
    url
    cronExpression
    enabled
    nextRun
  }
}
    `;
export const DeleteWebhookDocument = `
    mutation DeleteWebhook($id: ID!) {
  deleteCronWebhook(id: $id)
}
    `;
export const TriggerWebhookDocument = `
    mutation TriggerWebhook($id: ID!) {
  triggerWebhook(id: $id)
}
    `;
export const UpdateWebhookDocument = `
    mutation UpdateWebhook($id: ID!, $url: String, $cronExpression: String, $enabled: Boolean) {
  updateCronWebhook(
    id: $id
    url: $url
    cronExpression: $cronExpression
    enabled: $enabled
  ) {
    id
    url
    cronExpression
    enabled
    nextRun
  }
}
    `;
export const WebhookDocument = `
    query Webhook($id: ID!) {
  cronWebhook(id: $id) {
    id
    url
    cronExpression
    enabled
    nextRun
  }
}
    `;
export const WebhooksDocument = `
    query Webhooks {
  cronWebhooks {
    id
    url
    cronExpression
    enabled
    nextRun
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateWebhook(variables: CreateWebhookMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: CreateWebhookMutation; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<CreateWebhookMutation>(CreateWebhookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateWebhook', 'mutation', variables);
    },
    DeleteWebhook(variables: DeleteWebhookMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: DeleteWebhookMutation; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<DeleteWebhookMutation>(DeleteWebhookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteWebhook', 'mutation', variables);
    },
    TriggerWebhook(variables: TriggerWebhookMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: TriggerWebhookMutation; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<TriggerWebhookMutation>(TriggerWebhookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TriggerWebhook', 'mutation', variables);
    },
    UpdateWebhook(variables: UpdateWebhookMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: UpdateWebhookMutation; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<UpdateWebhookMutation>(UpdateWebhookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateWebhook', 'mutation', variables);
    },
    Webhook(variables: WebhookQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: WebhookQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<WebhookQuery>(WebhookDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Webhook', 'query', variables);
    },
    Webhooks(variables?: WebhooksQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: WebhooksQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<WebhooksQuery>(WebhooksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Webhooks', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;