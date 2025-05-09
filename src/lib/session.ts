//import nextAppSession from 'next-app-session';
import { CartItem } from "@/types";
import { SessionOptions } from "iron-session";
// Your session data type

interface Settings {
    machineNumber: string;
    defaultPrice: string;
    defaultCustomerCode: string;
    defaultCustomerName: string;
    defaultVAT: string;
    defaultDocno: string;
    currency: string;
    defaultWhcode: string;
    defaultShelfcode: string;
}
export interface SessionData {
   username?: string;
   apiToken?: string;
   userData?: any;
   settings?: Settings;
   isLoggedIn: boolean;
   invoiceNo: string;
   cartData?: CartData;
}

export interface CartData {
    items: CartItem[];
    total: number;
    change?: number;
    cash?: number;
    docNo?: string;
    docDate?:string;
    isEdit?: boolean;
}

export const defaultSession: SessionData = {
   isLoggedIn: false,
   invoiceNo: '',
   cartData: {
    items: [],
    total: 0,
    change: 0,
    cash: 0,
    docNo: '',
    docDate: '',
    isEdit: false
   }
 };
 
 export const sessionOptions: SessionOptions = {
   // You need to create a secret key at least 32 characters long.
   password: process.env.SESSION_SECRET! || '0ueUlWRDDjvu7188rORSqZVuwWUVvJSyPGWw84J3HxgWmW9VKRP4RFzW2Imvb1Jr',
   cookieName: "pos-session",
   cookieOptions: {
     httpOnly: true,
     // Secure only works in `https` environments. So if the environment is `https`, it'll return true.
     secure: process.env.NODE_ENV === "production",
   },
 };
 