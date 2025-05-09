'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
//import { useAuth } from '@/contexts/AuthContext'
import { API_ENDPOINTS } from '@/config/api'
import { SignIn } from '../actions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function LoginPage() {
  const router = useRouter()
  //const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [machineNumber, setMachineNumber] = useState('001')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simple validation
    if (!username || !password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน')
      setIsLoading(false)
      return
    }

    try {
      // First check if user exists in sessionStorage to get machine number
      //let machineNumber = '001' // Default machine number if not found
      // const usersJson = sessionStorage.getItem('users')
      // let defaultCustomerCode = '0001'
      // let defaultVAT = '7'
      // let defaultPrice = '0'
      // let defaultDocno = '0001'
      // let currency = 'THB'
      // let defaultWhcode = '0001'
      // let defaultShelfcode = '0001'
      // if (usersJson) {
      //   const users = JSON.parse(usersJson)
      //   const localUser = users.find((u: any) => u.username === username)
      //   if (localUser) {
      //     setMachineNumber(localUser.settings.machineNumber)
      //     defaultCustomerCode = localUser.settings.defaultCustomerCode
      //     defaultVAT = localUser.settings.defaultVAT
      //     defaultPrice = localUser.settings.defaultPrice
      //     defaultDocno = localUser.settings.defaultDocno
      //     currency = localUser.settings.currency
      //     defaultWhcode = localUser.settings.defaultWhcode
      //     defaultShelfcode = localUser.settings.defaultShelfcode
      //   }
      // }
 

      const response = await SignIn(username, password, machineNumber)
     // console.log(response)
      if (response.status) {
        // Redirect to POS page
        //router.push('/pos')
        router.replace('/pos')
        
      } else {
        // API returned an error
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
      
      // Fallback to local authentication if API is unavailable
      // const usersJson = sessionStorage.getItem('users')
      // if (usersJson) {
      //   const users = JSON.parse(usersJson)
      //   const user = users.find((u: any) => u.username === username && u.password === password)
        
      //   if (user) {
      //     // Set current user
      //     login(user)
      //     router.push('/pos')
      //     return
      //   }
      // }
    } finally {
      setIsLoading(false)
    }
  }

  const handleMachineNumberChange = (value: string) => {
    setMachineNumber(value)
  }

  useEffect(() => {
   
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            POS System Login
          </CardTitle>
          <CardDescription className="text-center">
            เข้าสู่ระบบเพื่อใช้งาน POS System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="mb-2">
              <Label htmlFor="machineNumber" >หมายเลขเครื่อง</Label>
              <Select defaultValue={machineNumber} onValueChange={handleMachineNumberChange}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมายเลขเครื่อง" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POS001">POS001</SelectItem>
                  <SelectItem value="POS002">POS002</SelectItem>
                  <SelectItem value="POS003">POS003</SelectItem>
                </SelectContent>
              </Select>
              </div>
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="กรอกชื่อผู้ใช้" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="กรอกรหัสผ่าน" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            ยังไม่มีบัญชี? <Link href="/register" className="text-blue-600 hover:underline">ลงทะเบียน</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
