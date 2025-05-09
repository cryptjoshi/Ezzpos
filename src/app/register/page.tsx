'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    machineNumber: '',
    defaultPrice: '',
    defaultCustomerCode: '',
    defaultVAT: '7',  // Default VAT rate in Thailand is 7%
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.username || !formData.password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    if (!formData.machineNumber) {
      setError('กรุณากรอกหมายเลขเครื่อง')
      return
    }

    // Create user object
    const userData = {
      username: formData.username,
      password: formData.password,
      settings: {
        machineNumber: formData.machineNumber,
        defaultPrice: formData.defaultPrice || '0',
        defaultCustomerCode: formData.defaultCustomerCode || '0001',
        defaultVAT: formData.defaultVAT || '7'
      }
    }

    // Get existing users or create new array
    let users = []
    const usersJson = sessionStorage.getItem('users')
    if (usersJson) {
      users = JSON.parse(usersJson)
      
      // Check if username already exists
      if (users.some((user: any) => user.username === formData.username)) {
        setError('ชื่อผู้ใช้นี้มีอยู่แล้ว')
        return
      }
    }

    // Add new user
    users.push(userData)
    sessionStorage.setItem('users', JSON.stringify(users))
    
    // Store settings in session storage
    sessionStorage.setItem('currentUser', JSON.stringify(userData))
    sessionStorage.setItem('posSettings', JSON.stringify(userData.settings))
    
    // Redirect to login page
    router.push('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ลงทะเบียนผู้ใช้ใหม่
          </CardTitle>
          <CardDescription className="text-center">
            กรอกข้อมูลเพื่อลงทะเบียนใช้งาน POS System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <Input 
                id="username" 
                name="username"
                type="text" 
                placeholder="กรอกชื่อผู้ใช้" 
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="กรอกรหัสผ่าน" 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword"
                type="password" 
                placeholder="กรอกรหัสผ่านอีกครั้ง" 
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="machineNumber">หมายเลขเครื่อง</Label>
              <Input 
                id="machineNumber" 
                name="machineNumber"
                type="text" 
                placeholder="กรอกหมายเลขเครื่อง" 
                value={formData.machineNumber}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultPrice">ราคาเริ่มต้น</Label>
              <Input 
                id="defaultPrice" 
                name="defaultPrice"
                type="number" 
                placeholder="กรอกราคาเริ่มต้น" 
                value={formData.defaultPrice}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultCustomerCode">รหัสลูกค้าเริ่มต้น</Label>
              <Input 
                id="defaultCustomerCode" 
                name="defaultCustomerCode"
                type="text" 
                placeholder="กรอกรหัสลูกค้าเริ่มต้น" 
                value={formData.defaultCustomerCode}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultVAT">ภาษีมูลค่าเพิ่มเริ่มต้น (%)</Label>
              <Input 
                id="defaultVAT" 
                name="defaultVAT"
                type="number" 
                placeholder="กรอกภาษีมูลค่าเพิ่มเริ่มต้น" 
                value={formData.defaultVAT}
                onChange={handleChange}
              />
            </div>
            
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <Button type="submit" className="w-full">ลงทะเบียน</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            มีบัญชีอยู่แล้ว? <Link href="/login" className="text-blue-600 hover:underline">เข้าสู่ระบบ</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
