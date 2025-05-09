'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Settings } from 'lucide-react';
import Lottie from 'lottie-react';
import animationData from '@/assets/lottie/shopping-bag.json'
import { useRef } from 'react';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

interface ProductCardProps {
  product: Product;
  balance?: number;
}

export default function ProductCards({ product, balance = 10 }: ProductCardProps) {
  const lottieRef = useRef<any>(null);

  const handlePlay = () => {
    lottieRef.current?.play();
  };

  const handleStopAtEnd = () => {
    const totalFrames = lottieRef.current?.getDuration(true);
    if (totalFrames) {
      lottieRef.current?.goToAndStop(totalFrames - 1, true);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-md hover:shadow-xl transition">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
        <button className="text-muted-foreground hover:text-primary transition">
          <Settings className="w-5 h-5" />
        </button>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-4">
        <div
          onMouseEnter={handlePlay}
          onMouseLeave={handleStopAtEnd}
          className="w-full max-h-48"
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            autoplay={false}
            loop={false}
          />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">ราคา</p>
          <p className="text-xl font-bold text-green-600">${product.price.toFixed(2)}</p>

          <p className="text-sm text-muted-foreground mt-3">ยอดคงเหลือ</p>
          <p className="text-base font-medium text-blue-500">${balance.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
