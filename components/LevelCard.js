import Icon from './Icon';
import { LEVEL_XP, TASK_XP, levelProgress } from '@/lib/progression';

export default function LevelCard({ progress = levelProgress() }) {
  return <section className="level-card" aria-label="Mening darajam">
    <div className="level-medal" aria-hidden="true"><Icon name="star" size={45} /><strong>{progress.level}</strong></div>
    <div className="level-copy">
      <span className="eyebrow">MENING DARAJAM</span>
      <div className="level-heading"><h2>{progress.level}-daraja <span>Yangi marralar sari!</span></h2><span className="xp-total">Jami {progress.totalXp} XP</span></div>
      <div className="level-progress-label"><strong>{progress.currentXp} / {LEVEL_XP} XP</strong><span>{progress.nextLevel}-darajagacha {progress.remainingXp} XP</span></div>
      <div className="progress level-progress" role="progressbar" aria-label="Keyingi darajagacha tajriba" aria-valuemin={0} aria-valuemax={LEVEL_XP} aria-valuenow={progress.currentXp} aria-valuetext={`${progress.level}-daraja, ${progress.currentXp} / ${LEVEL_XP} XP`}>
        <span style={{ width: `${progress.currentXp / LEVEL_XP * 100}%` }} />
      </div>
      <p><Icon name="check" size={14} /> Ota-ona tasdiqlagan har bir vazifa uchun <strong>+{TASK_XP} XP</strong>. XP — tajriba ballari.</p>
    </div>
  </section>;
}
