'use client';

import {
  Card,
  CardTitle,
} from '@/components/ui/card';
//import { Settings, Plus, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
//import  ColorThief  from 'color-thief-react'; 
//import ColorThief from 'color-thief-browser';
import { cn } from '@/lib/utils';
import { iInvoice } from '@/types';
 
interface InvoiceCardProps {
  invoice: iInvoice
}

// คู่สี pastel + font ที่ contrast
const pastelPairs = [
  { bg: '#FFD1DC', text: '#4A001F' },
  { bg: '#FFFACD', text: '#4A4A00' },
  { bg: '#D1FFD6', text: '#004D1A' },
  { bg: '#D1E0FF', text: '#002266' },
  { bg: '#FFEFD1', text: '#663C00' },
];

function getRandomPastelPair() {
  const index = Math.floor(Math.random() * pastelPairs.length);
  return pastelPairs[index];
}

export default function InvoiceCard({ invoice, onClick }: InvoiceCardProps & { onClick: () => void }) {
  const [qty, setQty] = useState(0);

  const increaseQty = () => setQty((prev) => prev + 1);
  const decreaseQty = () => setQty((prev) => Math.max(0, prev - 1));
 
  const hasImage = false;
  const pastel = getRandomPastelPair();

  // ถ้ามี image ใช้ offwhite bg + text ดำ
  const backgroundColor = hasImage ? '#f5f5f5' : pastel.bg;
  const textColor = hasImage ? '#222222' : pastel.text;
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false); // เช็คว่าโหลดภาพได้หรือไม่
  const getRandomPastelColor = () => {
    const r = Math.floor(Math.random() * 128) + 127; // แค่ให้เป็นค่าในช่วง Pastel (สีอ่อน)
    const g = Math.floor(Math.random() * 128) + 127;
    const b = Math.floor(Math.random() * 128) + 127;
    return `rgb(${r}, ${g}, ${b})`;
  };
  
 
  // ฟังก์ชันสำหรับดึงสีหลักจากภาพ
  // const getDominantColor = (imageUrl: string) => {
  //   const img = new Image();
  //   img.src = imageUrl;
  //   img.crossOrigin = 'anonymous';

  //   img.onload = () => {
  //     try {
  //       const colorThief = new ColorThief();
  //       const palette = colorThief.getPalette(img, 5);  // ดึงสีจากภาพเป็นชุดของสี
  //       const dominant = palette[0];  // ใช้สีหลักเป็นสีแรก
  //       setDominantColor(`rgb(${dominant[0]}, ${dominant[1]}, ${dominant[2]})`);
  //       setImageLoaded(true);
  //     } catch (error) {
  //       console.error('ColorThief Error:', error);
  //       setImageLoaded(false);  // ถ้าเกิดข้อผิดพลาดจะเปลี่ยนเป็น false
  //     }
  //   };

  //   img.onerror = () => {
  //     setImageLoaded(false);
  //   };
  // };

  // useEffect(() => {
  //   if (false) {
  //    // getDominantColor(product.imageUrl);
  //   }
  // }, []);
      
  return (
    <Card className={cn("relative w-full max-w-3xl h-48 overflow-hidden rounded-2xl shadow-lg ")}
    style={{
        backgroundColor: getRandomPastelColor(), // ใช้สี Pastel ที่สุ่ม
      }}
    onClick={onClick}
    >
    <div className="absolute inset-0 bg-black opacity-60 rounded-2xl" /> {/* Overlay */}
      {/* Background */}

      {/* <ColorThief
        src={product.imageUrl}
        format="hex"
        crossOrigin="anonymous"
        onColorExtracted={handleColorExtracted}
      /> */}
      <div
         className="absolute inset-0 bg-cover bg-center"
         style={{
            backgroundImage: imageLoaded && hasImage 
              ? `url(${"https://via.placeholder.com/600x400"})`
              : 'none',
            backgroundColor: imageLoaded
              ? dominantColor || 'white'  // ใช้สีที่ดึงได้จากภาพ หรือสีขาว
              : getRandomPastelColor(),  // สี pastel หากไม่สามารถโหลดภาพได้
          }}
      />
   
      {/* Setting Button */}
      {/* <button className="absolute top-3 right-3 z-20 transition"
        style={{ color: textColor }}
      >
        <Settings className="w-5 h-5" />
      </button> */}

      {/* Content */}
      <div
        className="relative z-10 h-full w-full flex items-center px-6 justify-between"
        style={{ color: textColor }}
      >
        <div className="flex flex-col gap-2">
          <CardTitle className="text-lg font-semibold"
            style={{
              color: textColor,
              textShadow: hasImage ? '0 1px 2px rgba(255,255,255,0.4)' : 'none',
            }}
          >
            <span className="text-sm opacity-80">{invoice.docno}</span>
            <br />
            {invoice.arname.slice(0, 15)}
          </CardTitle>

          <div className="space-y-1">
            <p className="text-sm opacity-80">ราคา</p>
            <p className="text-xl font-bold">{invoice.totalamount.toFixed(2)} บาท</p>

            {/* <p className="text-sm mt-2 opacity-80">ยอดคงเหลือ</p>
            <p className="text-base font-medium">{invoice.quantity.toFixed(2)} ชิ้น</p> */}
          </div>
        </div>

  
        
      </div>
     
    </Card>
  );
}
