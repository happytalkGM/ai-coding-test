import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <Link href="/" legacyBehavior><a>홈</a></Link>
      <Link href="/tool-settings" legacyBehavior><a>도구 설정</a></Link>
    </nav>
  );
};

export default Navbar;
