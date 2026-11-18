import Image from 'next/image';
import hotel_image from '@/assets/images/background/hero-1.jpg';

// ------------------------------

export default function Banners() {
  const showBanner = true;

  return (
    <div className="bg-secondary flex-center relative z-10 h-40 overflow-hidden rounded-2xl">
      {/* {showBanner ? (
        <Image src={hotel_image} fill alt="هتل" className="object-cover" />
      ) : (
        <span className="font-medium">جایگاه نمایش بنر (Banner)</span>
      )} */}

      <span className="font-medium">جایگاه نمایش بنر (Banner)</span>
      <Image src={hotel_image} fill alt="هتل" className="-z-10 object-cover" />
    </div>
  );
}
