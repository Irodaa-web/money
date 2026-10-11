import Link from 'next/link';
import Icon from './Icon';
import styles from './Pricing.module.css';

const freeFeatures = [
  'Vazifalar berish va tasdiqlash',
  'Virtual balans va jamg‘arma maqsadlari',
  'Bajarilgan ishga rasm va izoh yuborish',
  'Ota-ona uchun Telegram xabarnomalari',
  'Boshlang‘ich moliyaviy darslar',
];

const plusFeatures = [
  'Takrorlanuvchi vazifalar',
  'Haftalik va oylik batafsil hisobotlar',
  'Tayyor vazifalar va oilaviy rejalar',
  'Telegram orqali rejalashtirilgan eslatmalar',
];

export default function Pricing() {
  return (
    <section
      id="tariflar"
      className={styles.section}
      aria-labelledby="pricing-title"
    >
      <div className={styles.heading}>
        <span className={styles.badge}>Tariflar</span>
        <h2 id="pricing-title">Oilangizga mos imkoniyatlar</h2>
        <p>Kichik qadamlar bilan boshlang, birga rivojlaning.</p>
      </div>

      <div className={styles.grid}>
        <article className={`${styles.card} ${styles.free}`}>
          <div>
            <h3>Boshlang‘ich</h3>
            <p>Oilaviy odatlarni birga boshlash uchun.</p>
          </div>

          <div className={styles.price}>
            <strong>Bepul</strong>
          </div>

          <Link href="/register" className={styles.button}>
            Boshlash
            <Icon name="arrow" size={18} />
          </Link>

          <ul className={styles.features}>
            {freeFeatures.map((feature) => (
              <li key={feature}>
                <Icon name="check" size={18} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={`${styles.card} ${styles.plus}`}>
          <div>
            <div className={styles.titleRow}>
              <h3>Oilaviy Plus</h3>
              <span className={styles.soon}>Tez kunda</span>
            </div>
            <p>Oila uchun qo‘shimcha qulayliklar.</p>
          </div>

          <div className={styles.price}>
            <div>
              <strong>19 000</strong>
              <span> so‘m / oy</span>
            </div>
            <small>Rejalashtirilgan narx</small>
          </div>

          <Link href="/register" className={styles.button}>
            Ro‘yxatdan o‘tish
            <Icon name="arrow" size={18} />
          </Link>

          <p className={styles.featureLabel}>
            Rejalashtirilgan imkoniyatlar
          </p>

          <ul className={styles.features}>
            {plusFeatures.map((feature) => (
              <li key={feature}>
                <Icon name="check" size={18} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}