import { User } from "src/app/infrastructure/auth/model/user.model";
import { ClientType } from "./clientType.model";
import { RegistrationRequestStatus } from "./registrationRequestStatus.model";

export interface Client {
    id: number; 
    user: User;
    type: ClientType;
    firstName?: string | null;
    lastName?: string | null;
    companyName?: string | null;
    pib?: number | null;
    address: string;
    city: string;
    country: string;
    isApproved: RegistrationRequestStatus;
}
