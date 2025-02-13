import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);


export async function mailSender(userEmail:string,templateId:string,dynamicData:Record<string,string>) {
  try {
    const msg = {
      to: userEmail,
      from: process.env.SENDGRID_VERIFIED_EMAIL as string,
      templateId,
      dynamic_template_data: dynamicData,
    };

    await sgMail.send(msg);
    console.log(` Email sent to ${userEmail} using template ${templateId}`);
  } catch (error: any) {
    console.error(" Error sending email:", error.response?.body || error);
  }
};
