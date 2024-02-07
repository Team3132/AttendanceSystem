import { BooleanOption, StringOption } from "necord";

export class QrCodeDto {
  @StringOption({
    name: "meeting",
    description: "The meeting to get the qr code for.",
    required: true,
    autocomplete: true,
  })
  meeting: string;
  @BooleanOption({
    name: "publish",
    description: "Whether to show the qr code",
    required: false,
  })
  publish?: boolean;
}
