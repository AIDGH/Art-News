import Image from "next/image";
import Link from "next/link";

type AdvertisementPlaceholderProps = {
  label?: string;
};

export function EcranNewsPromo() {
  return (
    <a
      href="https://instagram.com/ecrannews"
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-[110px] md:h-[120px] flex flex-row items-stretch justify-between bg-[#111] rounded-[32px] p-2 md:p-[10px] gap-2 md:gap-4 cursor-pointer hover:opacity-90 transition-opacity"
      aria-label="معرفی رسانه اکران نیوز"
    >
      <div
        className="w-[110px] md:w-[140px] shrink-0 bg-white rounded-[24px] p-2 flex items-center justify-center"
        aria-hidden="true"
      >
        <Image
          src="/ecran-logo.png"
          alt="لوگو اکران نیوز"
          width={180}
          height={180}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center text-right pl-2 pr-2 md:pr-4">
        <h3 className="text-white font-medium text-base mb-2">اکران نیوز</h3>
        <p className="text-gray-400 text-xs leading-relaxed">
          برای پیگیری لحظه‌ای حواشی و اخبار سینما، به صفحه رسمی اکران نیوز در
          اینستاگرام بپیوندید.
        </p>
      </div>
    </a>
  );
}

export function AdvertisementPlaceholder({
  label = "جایگاه تبلیغات",
}: AdvertisementPlaceholderProps) {
  return (
    <aside className="w-full h-[110px] md:h-[120px] flex flex-col items-center justify-center border-[1.5px] border-dashed border-gray-400 bg-[#f8f5ed] rounded-[32px] px-4 text-center gap-2" aria-label={label}>
      <h3 className="text-lg text-gray-800 font-bold">تبلیغات</h3>
      <small className="text-gray-500 text-xs">ابعاد و محتوای نهایی پس از دریافت سفارش تبلیغ مشخص می‌شود.</small>
    </aside>
  );
}
