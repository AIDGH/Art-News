import Image from "next/image";

export function EcranNewsPromo() {
  return (
    <a
      href="https://instagram.com/ecrannews"
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-[120px] md:h-[140px] flex flex-row items-stretch bg-[#111]"
      aria-label="معرفی رسانه اکران نیوز"
    >
      {/* Logo Container - Width exactly matches parent's height to create a perfect square */}
      <div className="w-[120px] md:w-[140px] shrink-0 bg-white flex items-center justify-center p-2 md:p-3">
        <Image alt="Ecran News Logo" className="w-full h-auto object-contain" height={140} src="/ecran-logo.png" width={140}/>
      </div>

      {/* Text Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-4 text-center">
        <p className="text-white text-center text-xs md:text-sm leading-relaxed font-medium w-full max-w-[280px] mx-auto">
          برای پیگیری لحظه‌ای حواشی و اخبار سینما، به صفحه رسمی اکران نیوز در اینستاگرام بپیوندید.
        </p>
      </div>
    </a>
  );
}

export function AdvertisementPlaceholder({
  label = "جایگاه تبلیغات",
}: { label?: string } = {}) {
  return (
    <div
      className="w-full h-[120px] md:h-[140px] flex flex-col items-center justify-center border-[1.5px] border-dashed border-gray-400 bg-transparent rounded-none px-4 text-center mt-6"
      aria-label={label}
    >
      <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">تبلیغات</h3>
      <p className="text-xs md:text-sm text-gray-500">
        ابعاد و محتوای نهایی پس از دریافت سفارش تبلیغ مشخص میشود.
      </p>
    </div>
  );
}
