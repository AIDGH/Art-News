type AdvertisementPlaceholderProps = {
  label?: string;
};

export function EcranNewsPromo() {
  return (
    <section className="ecran-promo" aria-label="معرفی رسانه اکران نیوز">
      <div className="ecran-logo-placeholder" aria-hidden="true">
        <span>محل لوگو</span>
        <strong>ECRAN NEWS</strong>
      </div>
      <div>
        <span className="promo-kicker">رسانه همراه</span>
        <h2>اکران نیوز</h2>
        <p>
          لوگو و لینک رسمی اکران نیوز پس از دریافت فایل‌های برند در این بخش
          قرار می‌گیرد.
        </p>
      </div>
      <span className="promo-link-placeholder">لینک شبکه اجتماعی</span>
    </section>
  );
}

export function AdvertisementPlaceholder({
  label = "جایگاه تبلیغات",
}: AdvertisementPlaceholderProps) {
  return (
    <aside className="advertisement-placeholder" aria-label={label}>
      <span>تبلیغات</span>
      <strong>{label}</strong>
      <small>ابعاد و محتوای نهایی پس از دریافت سفارش تبلیغ مشخص می‌شود.</small>
    </aside>
  );
}
