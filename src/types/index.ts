export interface iProduct {
  code: string
  name: string
  price1: number
  price2: number
  price3: number
  quantity: number
  unit: string
  unitcode: string
}

export interface CartItem {
  id: string
  code: string
  name: string
  whcode: string
  shelfcode: string
  price: number
  unit:string
  unitcode: string
  quantity: number
  total:number
}


export interface iInvoice {
  docno: string
  docdate: string
  arcode: string
  arname: string
  totalamount: number
}

export interface iInvoiceSub {
  id: string
  taxno:string
  docno:string
  docdate:string
  itemcode: string
  itemname: string
  whcode: string
  shelfcode: string
  price: number
  unit:string
  unitcode: string
  quantity: number
  amount:number
  total:number
  qty: number
}

export interface iCustomer {
  code: string
  name: string
  address: string
  debtamount: number
}
