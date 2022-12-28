import mailing from "@sendgrid/mail";

mailing.setApiKey(String(process.env.MAILING_API_KEY));

export default mailing;
