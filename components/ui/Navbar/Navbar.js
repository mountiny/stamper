import Link from 'next/link';
import s from './Navbar.module.css';
import Logo from '../../icons/Logo';
import { useUser } from '../../UserContext';
import { useRouter } from 'next/router'

const Navbar = () => {
  const router = useRouter()
  const { user, signOut } = useUser();

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo inverted={true} />
              </a>
            </Link>
            <nav className="space-x-2 ml-6 hidden lg:block">
                <Link href="/">
                  <a className={s.link}>Home</a>
                </Link>
              {
                !user && (
                <Link href="/pricing">
                  <a className={s.link}>Pricing</a>
                </Link>
                )
              }
              {
                user && (
                  <Link href="/account">
                    <a className={s.link}>Account</a>
                  </Link>
                )
              }
            </nav>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            {user ? (
              <Link href="#">
                <a className={s.link} onClick={() => signOut()}>
                  Sign out
                </a>
              </Link>
            ) : (
              router.pathname !== "/signin" ? (
                <Link href="/signin">
                  <a className={s.link}>Sign in</a>
                </Link>
              ) : (
                <Link href="/signup">
                  <a className={s.link}>Sign up</a>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
