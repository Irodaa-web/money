import Link from 'next/link';
import Icon from './Icon';
import { moneyText } from '@/lib/format';

export default function FamilyBalances({ summary, showLink = false }) {
  if (!summary) return null;
  return <section className="family-balances" aria-label="Farzandlar bo‘yicha hisob">
    <div className="section-heading"><h2><Icon name="users" size={22} /> Farzandlar bo‘yicha hisob</h2>{showLink && <Link className="text-link" href="/parent/wallet">Hisob va so‘rovlar <Icon name="arrow" size={16} /></Link>}</div>
    <div className="family-total-strip">
      <div className="family-total-main"><span>Jami berilmagan mukofot</span><strong>{moneyText(summary.totals.owed)}</strong><small>Barcha farzandlarning balansi + jamg‘armasi</small></div>
      <div><span>Hozir so‘ralgan pul</span><strong>{moneyText(summary.totals.reserved)}</strong><small>Kutilayotgan so‘rovlar · jami ichida</small></div>
      <div><span>Maqsadlarga jamg‘arilgan</span><strong>{moneyText(summary.totals.saved)}</strong><small>Jamg‘armalar ham jami ichida</small></div>
    </div>
    {summary.children.length ? <div className="child-balance-list">{summary.children.map(child => <article className="child-balance-card" key={child.childId}>
      <div className="child-balance-person"><span className="avatar">{child.name.charAt(0).toUpperCase()}</span><div><h3>{child.name}</h3><small>Berilmagan mukofot <strong>{moneyText(child.owed)}</strong></small></div></div>
      <dl><div><dt>Balansida</dt><dd>{moneyText(child.balance)}</dd></div><div><dt>Jamg‘armasida</dt><dd>{moneyText(child.saved)}</dd></div><div className={child.reserved > 0 ? 'requested-balance' : ''}><dt>Hozir so‘ragani</dt><dd>{moneyText(child.reserved)}</dd></div></dl>
    </article>)}</div> : <div className="family-balance-empty"><p>Farzandingizni ulasangiz, uning hisobi shu yerda ko‘rinadi.</p><Link href="/parent/family" className="text-link">Farzandni taklif qilish <Icon name="arrow" size={16} /></Link></div>}
    <p className="balance-explanation"><Icon name="leaf" size={15} /><span>Faqat tasdiqlangan mukofotlar hisoblanadi. So‘ralgan pul balans tarkibida; qayta qo‘shilmaydi. “Pulni berdim” tasdiqlangach, balans va jami summa kamayadi. Sayt pul o‘tkazmaydi.</span></p>
  </section>;
}
