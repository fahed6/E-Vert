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

    async deactivateMail(userEmail:string,dynamicData0:string){
        const templateId=process.env.DEACTIVATE_TEMPLATE_ID as string;
        const dynamicData={
            name:dynamicData0
          }
        return mailSender(userEmail,templateId,dynamicData);
    }

    async activateMail(userEmail:string,dynamicData0:string){
        const templateId=process.env.ACTIVATE_TEMPLATE_ID as string;
        const dynamicData={
            name:dynamicData0
          }
        return mailSender(userEmail,templateId,dynamicData);
    }

    async infoChange(userEmail:string,dynamicData0:string){
      const templateId=process.env.INFO_CHANGE_TEMPLATE_ID as string;
      const dynamicData={
          name:dynamicData0
        }
      return mailSender(userEmail,templateId,dynamicData);
  }
}