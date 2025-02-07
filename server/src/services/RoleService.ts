import { setAdminRole } from "../middlewares/setAdmin";
import { setPartnerRole } from "../middlewares/setPartner";

export class RoleService{

    async setAdmin(uid: string){
        return setAdminRole(uid);
    }

    async setPartner(uid: string){
        return setPartnerRole(uid);
    }
}