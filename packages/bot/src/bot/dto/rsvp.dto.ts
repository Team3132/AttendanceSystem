import { StringOption } from "necord";

const statusChoices = [
  {
    name: "Coming",
    value: "YES" as const,
  },
  {
    name: "Maybe",
    value: "MAYBE" as const,
  },
  {
    name: "Not Coming",
    value: "NO" as const,
  },
];

type Status = (typeof statusChoices)[number]["value"];

export class RsvpDto {
  @StringOption({
    name: "meeting",
    description: "The meeting to rsvp to.",
    required: true,
    autocomplete: true,
  })
  meeting: string;
  @StringOption({
    name: "status",
    description: "The status you want to set.",
    required: true,
    choices: statusChoices,
  })
  status: Status;
}
