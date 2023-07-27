import type { ReactElement } from "react";
import { Resend } from "resend";

import { validateEmailNotDisposable } from "./emails/utils/utils";
import WaitingList from "./emails/waiting-list";
import WelcomeEmail from "./emails/welcome";
import { env } from "./env";

export { WelcomeEmail, WaitingList, validateEmailNotDisposable };

const resend = new Resend(env.RESEND_API_KEY);

export interface Emails {
  react: ReactElement;
  subject: "Welcome to OpenStatus.dev 👋";
  to: string[];
  from: "Thibault Le Ouay Ducasse <thibault@openstatus.dev>";
}

export const sendEmail = async (email: Emails) => {
  await resend.emails.send(email);
};
