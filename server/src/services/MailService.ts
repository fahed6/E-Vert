import dotenv from "dotenv";
import { mailSender } from "../middlewares/mailSender";
dotenv.config();

export class MailService{

    async welcomeMail(userEmail:string,dynamicData0:string){
        const templateId=process.env.WELCOME_TEMPLATE_ID as string;
        const dynamicData={
            name:dynamicData0
          }
        return mailSender(userEmail,templateId,dynamicData);
    }
}