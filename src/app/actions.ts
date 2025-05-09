'use server'
import { CartData, SessionData} from "@/lib/session"
import {defaultSession,sessionOptions} from "@/lib/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import {redirect} from "next/navigation"
import { API_ENDPOINTS } from "@/config/api"
import { CartItem, iProduct } from "@/types"
import { formatInTimeZone,toDate, format } from 'date-fns-tz'
//@ts-ignore
import {z} from "zod"

const formSchema = z.object({
  machineNumber: z.string().min(1, "กรุณากรอกหมายเลขเครื่อง"),
  defaultCustomerName: z.string().optional().default(''),
  defaultCustomerCode: z.string().min(1, "กรุณากรอกลูกค้าเริ่มต้น"),
  defaultWhcode: z.string().min(1, "กรุณากรอกคลังสินค้า"),
  defaultShelfcode: z.string().min(1, "กรุณากรอกที่เก็บสินค้า"),
  defaultPrice: z.string().min(1, "กรุณากรอกราคาเริ่มต้น"),
  defaultVAT: z.string().min(1, "กรุณากรอกราคาภาษี"),
  defaultDocno: z.string().min(1, "กรุณากรอกรูปแบบเลขที่เอกสาร"),
  currency: z.string().min(1, "กรุณากรอกสกุลเงิน"),
})

export async function getSession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
    // If user visits for the first time session returns an empty object.
    // Let's add the isLoggedIn property to this object and its value will be the default value which is false
    if (!session.isLoggedIn) {
      session.isLoggedIn = defaultSession.isLoggedIn;
    }
  
    return session;
  }
//   export async function getSession() {
//     const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

//     // If user visits for the first time session returns an empty object.
//     // Let's add the isLoggedIn property to this object and its value will be the default value which is false
//     if (!session.isLoggedIn) {
//         session.isLoggedIn = defaultSession.isLoggedIn;
//     }

//     // Convert the session object to a plain JavaScript object
//     const plainSession = { ...session };

//     return plainSession;
// }
// export async function getSession() {
//     const session: IronSession<SessionData> = await getIronSession<SessionData>(await cookies(), sessionOptions);

//     // If user visits for the first time session returns an empty object.
//     // Let's add the isLoggedIn property to this object and its value will be the default value which is false
//     if (!session.isLoggedIn) {
//         session.isLoggedIn = defaultSession.isLoggedIn;
//     }

//     // Convert the session object to a plain JavaScript object
//     const plainSession = { ...session };

//     return plainSession;
// }

export async function getProducts(price?: string) {
    const session = await getSession()
    const token = session.apiToken
 
    const response = await fetch(API_ENDPOINTS.products,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            price:  price
        })
    })
    const data = await response.json()
    return data
}
export async function SignOut() {
    const session = await getSession()
    session.isLoggedIn = false
    session.username = ''
    session.apiToken = ''
    session.userData = {}
    session.settings = {
        machineNumber: '',
        defaultCustomerName: '',
        defaultPrice: '',
        defaultCustomerCode: '',
        defaultVAT: '',
        defaultDocno: '',
        currency: '',
        defaultWhcode: '',
        defaultShelfcode: ''
    }
    await session.save()
    redirect('/login')
     
}
export async function SignIn(username: string, password: string, machineNumber: string) {
   

    // Call the external API
    const response = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
        dbname: 'TEST01',
        server: 'BLACKNITRO',
        prefix: 'TEST01',
        posid: machineNumber
      }),
    })
    const session = await getSession()
    const data = await response.json()

    if (response.ok) {
        session.isLoggedIn = true
        session.username = username
        session.apiToken = data.Token    
        session.userData = data.Data
      // Create or update user in session storage
      const res = await getMasterData(machineNumber,data.Token)
      if(res.Data.data.length>0){
      const master = JSON.parse(res.Data.data)
       session.isLoggedIn = true
       session.username = username
       session.apiToken = data.Token    
       session.userData = data.Data
       session.settings = {
         machineNumber: machineNumber,
         defaultCustomerName: master.defaultCustomerName,
         defaultPrice: master.defaultPrice,
         defaultCustomerCode: master.defaultCustomerCode,
         defaultVAT: master.defaultVAT,
         defaultDocno: master.defaultDocno,
         currency: master.currency,
         defaultWhcode: master.defaultWhcode,
         defaultShelfcode: master.defaultShelfcode
       }
    } else {
        session.isLoggedIn = true
        session.username = username
        session.apiToken = data.Token    
        session.userData = data.Data
        session.settings = {
          machineNumber: machineNumber,
          defaultCustomerName: "ลูกค้าทั่วไป",
          defaultPrice:  "1",
          defaultCustomerCode: "ar-0001",
          defaultVAT: "7%",
          defaultDocno: machineNumber+"YYMM-####",
          currency: "THB",
          defaultWhcode: "01",
          defaultShelfcode: "01"
        }
    }   
   
   // const invoice = await GetInvoiceNo(data.Token)
   // console.log(invoice)
   // if(invoice.status)
   // session.invoiceNo = invoice.Data

    await session.save()
       
    }
    return {'status':session.isLoggedIn}
}

export async function addCart(items:iProduct) {
    const session = await getSession()
    //console.log(session)
    const cartData = session.cartData || defaultSession.cartData || { items: [], total: 0 }
    //console.log(cartData)
    // const updatedCartData = {
    //   ...cartData,
    //   items: cartData.items + 1,
    //   total: cartData.total + items.price1
    // }
     
    session.cartData = {items: cartData.items, total: cartData.total + items.price1}
    //session.cartData?.total = cartData.total + items.price1
    //console.log(session.cartData)
    await session.save()
    return session.cartData
  }
export async function clearCart() {
    const session = await getSession()
    session.cartData = defaultSession.cartData
    await session.save()
    return session.cartData
}
export async function AddInvoice() {
    const session = await getSession()
    const token = session.apiToken
    const response = await fetch(API_ENDPOINTS.addInvoice,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            cartData: session.cartData,
            userData: session.userData,
            settings: session.settings,
            docno: session.settings?.defaultCustomerCode || '0001',
            arcode: session.settings?.defaultCustomerCode || '0001',
            vat: session.settings?.defaultVAT || '7',
            total: session.cartData?.total || 0,
            items: session.cartData?.items || [],
        }),
    })
    const data = await response.json()
    return data
}

export async function getMasterData(posid:string,token:string) {
    const response = await fetch(API_ENDPOINTS.getMasterData,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            posid:  posid 
        })
    })
    const data = await response.json()
  
    // session.settings?.defaultCustomerCode = JSON.parse(data.data).customer
    // session.settings?.defaultWhcode = JSON.parse(data.data).whcode
    // session.settings?.defaultPrice = JSON.parse(data.data).price
    // session.settings?.defaultVAT = JSON.parse(data.data).taxrate
    // session.settings?.defaultDocno = JSON.parse(data.data).docnoformat
    // session.settings?.currency = JSON.parse(data.data).targetCurrency
   // await session.save()
    return data
}

export async function updateSettings(posid:string,data:z.infer<typeof formSchema>) {
 
    const session = await getSession()
    const token = session.apiToken
    const response = await fetch(API_ENDPOINTS.updateSettings,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            posid:  posid,
            data: JSON.stringify(data)

        })
    })
    const res = await response.json()
    if (response.ok) {
        session.settings = data
        await session.save()
    }
 
    // session.settings?.defaultCustomerCode = JSON.parse(data.data).customer
    // session.settings?.defaultWhcode = JSON.parse(data.data).whcode
    // session.settings?.defaultPrice = JSON.parse(data.data).price
    // session.settings?.defaultVAT = JSON.parse(data.data).taxrate
    // session.settings?.defaultDocno = JSON.parse(data.data).docnoformat
    // session.settings?.currency = JSON.parse(data.data).targetCurrency
   // await session.save()
    return res
}
export async function SaveSessionDoc(docno:string){
    const session = await getSession()
    session.invoiceNo = docno;
    await session.save()
    return {status:true,Data:docno}
}
export async function  GetInvoiceNo(){
 
    const session = await getSession();
    //const plainSession = JSON.parse(JSON.stringify(session));
    if (!session.apiToken) {
        throw new Error('API token not found');
      }
    // const state = useAuthStore()
    //const access_token = session.apiToken?session.apiToken:token
   
  
    const response = await fetch(`${API_ENDPOINTS.getInvoiceNo}`, { method: 'POST',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +  session.apiToken
          },
          body: JSON.stringify({"posid":session.settings?.machineNumber,"docformat":session.settings?.defaultDocno})
        })
        return response.json();
         
         
       
  }
export async function  GetInvoiceNoX(token:string){
 
    const session = await getSession();
    //const plainSession = JSON.parse(JSON.stringify(session));
    if (!session.apiToken && !token) {
        throw new Error('API token not found');
      }
    // const state = useAuthStore()
    const access_token = session.apiToken?session.apiToken:token
   
  
    const response = await fetch(`${API_ENDPOINTS.getInvoiceNo}`, { method: 'POST',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +  access_token
          },
          body: JSON.stringify({"posid":session.settings?.machineNumber,"docformat":session.settings?.defaultDocno})
        })
        return response.json();
         
         
       
  }
export async function addInvoice(invoice:CartData) {
    const session = await getSession()
    const token = session.apiToken
    //const docno = await GetInvoiceNo()
   
    const today = formatInTimeZone(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd');
   
   
    const taxrate = parseFloat(session.settings?.defaultVAT.replace("%","") || "7")
    const beforetaxamount = parseFloat((invoice.total / ((100+taxrate)/100)).toFixed(2))
    const bill_detail  = {
        invoice:{
            docno: invoice.docNo,
            taxno:invoice.docNo, // เปลี่ยนเป็นเลขที่เอกสารจริง
            docdate: toDate(today),
            arcode: session.settings?.defaultCustomerCode,
            arname: session.settings?.defaultCustomerName, // ใช้รหัสลูกค้า
        //   items: items, // ใช้รายการสินค้าที่ถูกเลือก
            SumofItemAmount: invoice.total ? invoice.total : 0, 
            AfterDiscount: invoice.total ? invoice.total : 0, 
            BeforeTaxamount: invoice.total ? beforetaxamount : 0, 
            TaxAmount: invoice.total ? parseFloat((invoice.total-beforetaxamount).toFixed(2)) : 0,
            totalamount: invoice.total ? invoice.total : 0, // ยอดรวม
            HomeAmount: invoice.total ? invoice.total : 0,
            billbalance: invoice.total ? invoice.total : 0,
            netdebtamount: invoice.total ? invoice.total : 0, 
            SumcashAmount: invoice.cash ? invoice.cash : 0, // ยอดเงินที่รับ
            sumchangeamount: invoice.change ? invoice.change : 0,
            PayBillStatus:0,
            ExchangeRate:1,
            IsCancel:0,
            IsCompleteSave:1,
            posstatus:0,
            BillType:0,
            TaxType:1,
            TaxRate:taxrate,
            GLFormat:"B2"
            },
        invoicesub:invoice.items
    }
    
   

    const response = await fetch(API_ENDPOINTS.addInvoice,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bill_detail),
    })
    const data = await response.json()
    if (response.ok) {
        session.cartData = {items: [], total: 0,cash: 0, change: 0}
        await session.save()
    }
    return data

}
export async function getInvoice(posid:string) {
    const session = await getSession()
    const token = session.apiToken
    const response = await fetch(API_ENDPOINTS.getInvoice,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            posid:  posid 
        })
    })
    const data = await response.json()
    return data
}

export async function getCustomers() {
    const session = await getSession()
    const token = session.apiToken
    const response = await fetch(API_ENDPOINTS.getCustomers,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
    const data = await response.json()
    return data
}

export async function getInvoiceByDocno(docno:string) {
    const session = await getSession()
    const token = session.apiToken
    const response = await fetch(API_ENDPOINTS.getInvoiceByDocno,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            docno:  docno 
        })
    })
    const data = await response.json()
    return data
}
