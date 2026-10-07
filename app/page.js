import Link from 'next/link';

import Brand from '@/components/Brand';
import Icon from '@/components/Icon';

const steps = [
  {
    number: '01',
    icon: 'users',
    title: 'Oilangizni ulang',
    description:
      'Ota-ona hisob ochadi va farzandiga bir martalik taklif kodi beradi.',
  },
  {
    number: '02',
    icon: 'tasks',
    title: 'Vazifa bering, rag‘batlantiring',
    description:
      'Nima qilish, qachongacha va qancha mukofot — hammasi bir joyda.',
  },
  {
    number: '03',
    icon: 'target',
    title: 'Maqsad sari jamg‘aring',
    description:
      'Bola bajarganini yuboradi. Tasdiqdan so‘ng mukofot virtual balansga tushadi.',
  },
];

export default function Home() {
  return (
    <main className="landing">
      {/* Yuqori menyu */}
      <nav className="landing-nav">
        <Brand />

        <div>
          <Link href="#qanday">
            Qanday ishlaydi?
          </Link>

          <Link className="button light" href="/login">
            Kirish
            <Icon name="arrow" />
          </Link>
        </div>
      </nav>

      {/* Asosiy tanishtiruv */}
      <section className="hero">
        <div>
          <span className="pill">
            <span className="dot" />
            Oilalar uchun moliyaviy ta’lim
          </span>

          <h1>
            Pulning qadrini
            <br />
            <em>birga o‘rganamiz.</em>
          </h1>

          <p>
            Vazifalarni bajaramiz, ilk mukofotni olamiz va orzularimiz
            uchun jamg‘aramiz. Ota-ona va farzand — bitta jamoa.
          </p>

          <div className="hero-actions">
            <Link href="/register" className="button primary">
              Oilamiz bilan boshlash
              <Icon name="arrow" />
            </Link>

            <Link href="/login" className="text-link">
              Mening kabinetim →
            </Link>
          </div>

          <div className="hero-note">
            <Icon name="check" size={17} />

            Karta kerak emas

            <span>•</span>

            Virtual hisob

            <span>•</span>

            O‘zbek tilida
          </div>
        </div>

        {/* Kabinetning ko‘rgazmali namunasi */}
        <div className="hero-art">
          <div className="art-orbit" />

          <div className="floating-badge">
            <span className="success-icon">
              <Icon name="check" />
            </span>

            <span>
              Vazifa tasdiqlandi!
              <strong>+ 20 000 so‘m</strong>
            </span>
          </div>

          <div className="hero-preview">
            <div className="preview-top">
              <span className="avatar">A</span>

              <div>
                <small>SALOM, AZIZ!</small>
                <strong>Orzular sari yana bir qadam 🌱</strong>
              </div>
            </div>

            <div className="preview-balance">
              <small>MENING VIRTUAL BALANSIM</small>

              <h2>
                120 000 <span>so‘m</span>
              </h2>

              <span>Harakatingizning natijasi ✨</span>
            </div>

            <div className="preview-goal">
              <div className="goal-emoji">🚲</div>

              <div>
                <strong>Birinchi velosipedim</strong>
                <small>120 000 / 400 000 so‘m</small>
              </div>
            </div>

            <div className="progress">
              <span style={{ width: '30%' }} />
            </div>

            <small className="preview-caption">
              Bu ko‘rgazmali namuna. Haqiqiy bank hisobi emas.
            </small>
          </div>

          <div className="floating-star">✦</div>
        </div>
      </section>

      {/* Foydalanish bosqichlari */}
      <section className="how-section" id="qanday">
        <span className="eyebrow">
          JUDA OSON BOSHLANADI
        </span>

        <h2>Uch qadam. Bir yangi odat.</h2>

        <div className="how-grid">
          {steps.map((step) => (
            <article key={step.number}>
              <div className="how-number">
                <Icon name={step.icon} size={27} />
                <span>{step.number}</span>
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Pastki qism */}
      <footer>
        <Brand />

        <p>
          Birinchi pul — katta hayotga kichik qadam.
        </p>

        <span>
          Virtual mukofotlar. Haqiqiy ko‘nikmalar.
        </span>
      </footer>
    </main>
  );
}