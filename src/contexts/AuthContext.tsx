// contexts/AuthContext.tsx
'use client'
import { createContext, useState, useEffect, useContext } from 'react';
import { CartData, defaultSession, SessionData } from '@/lib/session';
import { getSession } from '@/app/actions';// Import session instance ของคุณ
//import { useRouter } from 'next/navigation'; // หรือ 'next/router' สำหรับ Pages Router
import Loading from '@/components/loading'; // Component สำหรับแสดงระหว่างโหลด

interface AuthContextType {
  sessionData: SessionData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  cartData: CartData;
  setSessionCartData: (cartData: CartData) => void;
}

const AuthContext = createContext<AuthContextType>({
  sessionData: null,
  isLoading: true,
  isAuthenticated: false,
  cartData: defaultSession.cartData || { items: [], total: 0, change: 0 },
  setSessionCartData: () => {},  
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
  serverSession?: SessionData; // ข้อมูล session ที่ส่งมาจาก Server
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, serverSession }) => {
  const [sessionData, setSessionData] = useState(serverSession);
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    setIsLoading(true)
    if (serverSession) {
      // ถ้ามี serverSession เข้ามา ให้ใช้ค่านี้เลย (หลังจากการ refresh ก็จะเข้ามาที่นี่)
      setSessionData(serverSession);
      setIsLoading(false);
  } else 
    if (serverSession === undefined && sessionData?.isLoggedIn === false) {
      // กรณีที่ serverSession ไม่ได้ถูกส่งมา (อาจจะอยู่ใน Client-Side Navigation)
      const fetchSession = async () => {
        setIsLoading(true);
        try {
          const res = await getSession() //fetch('/api/session'); // สร้าง API route เพื่อดึง session
          if (res.isLoggedIn) {
           // console.log(res)
            setSessionData(res);
          } else {
            setSessionData(undefined);
          }
        } catch (error) {
          console.error('Error fetching session:', error);
          setSessionData(undefined);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSession();
    } else {
      setIsLoading(false);
    }
  }, [serverSession]);

  const isAuthenticated = !!sessionData?.apiToken; // ตัวอย่างการตรวจสอบว่า authenticated หรือไม่

  const value: AuthContextType = {
    sessionData: sessionData || null,
    isLoading,
    isAuthenticated,
    cartData: sessionData?.cartData || defaultSession.cartData || { items: [], total: 0, change: 0 },
    setSessionCartData: (cartData: any) => {
      setSessionData({ ...sessionData!, cartData });
    },
    // อาจมี functions อื่นๆ ที่นี่
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};