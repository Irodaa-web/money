import Link from 'next/link';
import Icon from './Icon';
export default function Brand() { return <Link href="/" className="brand"><span className="brand-mark"><Icon name="leaf" size={23} /></span><span>birinchi<span className="brand-light">pul</span><i /></span></Link>; }
