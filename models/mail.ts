import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);

export const mailing = mailgun.client({
	username: "api",
	key: process.env.MAILING_API_KEY || "",
});

export const domain = String(process.env.MAILING_DOMAIN);
