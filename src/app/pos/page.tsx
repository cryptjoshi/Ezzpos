'use client'

import { SettingsMenu } from "@/components/shared/SettingsMenu"
import { ProductGrid } from "@/components/pos/ProductGrid"
import { Cart } from "@/components/pos/Cart"
import { MenuBar } from "@/components/pos/MenuBar"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { ReceiptDialog } from "@/components/dialogs/ReceiptDialog"
import React, { Component, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DoorClosed, LogOut, LucideLogOut, Settings } from "lucide-react"
import { PosSettingDialog } from "@/components/dialogs/SettingDialog"
import { formatDateTime, formatTime } from "@/lib/utils"
import { SignOut,GetInvoiceNo, getSession,SaveSessionDoc } from "../actions"

export default function POSPage() {

  const { sessionData,cartData, setSessionCartData } = useAuth()
  const [receiptDialog, setReceiptDialog] = useState(false)
  const [component, setComponent] = useState<React.ReactNode>(<ProductGrid />)
  const [selectedMenu, setSelectedMenu] = useState<number>(1)
  const [openDialog,setOpenDialog] = useState(false)
  const handleReceiptDialog = (open: boolean) => {
    setReceiptDialog(open)
  }

 const [now, setNow] = useState(new Date());

 useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000); // Update every 1 second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  
  const getDocumentNumber = async () => {
      
    const docNo = await GetInvoiceNo()
   // console.log(cartData)
    const newCartData = {...cartData,items:[],total:0,isEdit:false,docNo:docNo.Data,docDate:formatDateTime(new Date())}
   
    localStorage.setItem('cartData', JSON.stringify(newCartData));
    const res = await SaveSessionDoc(docNo.Data)
   // console.log(newCartData)
    setSessionCartData(newCartData);
}

  useEffect(() => {
   
    getDocumentNumber()
  }, [])


  const showComponent= (id:number,component:React.ReactNode) =>{
    if(id==1){
      getDocumentNumber()
    } 
    setComponent(component)
  }


  return (
    <ProtectedRoute>
      <div>
        <header className="border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                POS System
              </h1>
              
              { sessionData && sessionData.settings && (
                <p className="text-sm text-gray-500">
                   {/* วันที่: {formatDateTime(now)}  เวลา: {formatTime(now)} | */}
                   วันที่: {formatDateTime(now)}   |
                  หมายเลขเครื่อง: {sessionData.settings.machineNumber || 'POSxx'} | 
                  รหัสลูกค้า: {sessionData.settings.defaultCustomerCode || 'AR-xxxx'} |
                  ชื่อลูกค้า: {sessionData.settings.defaultCustomerName || 'xxxx'} |
                  ภาษี: {sessionData.settings.defaultVAT || 7+"%"}
                </p>
              )}
             
            </div>
            {/* <Button variant="outline" size="icon" className="w-9 h-9" onClick={() => setOpenDialog(true)}><Settings className="h-4 w-4" /></Button> */}
            <div className="flex flex-row item-between gap-2">
            <PosSettingDialog open={openDialog} setOpen={setOpenDialog}/>
            <Button variant={"outline"} onClick={()=>{SignOut()}}><LucideLogOut /></Button>
            </div>
            {/* <SettingsMenu /> */}
          </div>
        </header>

        <main className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <MenuBar selectedMenu={selectedMenu} onSelect={(id: number) => {setSelectedMenu(id)}} setComponent={(id:number,component: React.ReactNode) => showComponent(id,component)} />
              {/* <ProductGrid /> */}
              {component}
            </div>
            <div className="md:col-span-1">
              <Cart setReceiptDialog={handleReceiptDialog} />
            </div>
          </div>
           <ReceiptDialog total={sessionData?.cartData?.total || 0} open={receiptDialog} setOpen={handleReceiptDialog}/>
        </main>
      </div>
    </ProtectedRoute>
  )
}
