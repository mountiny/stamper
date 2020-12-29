import Link from 'next/link';
import Logo from '../../icons/Logo';
import GitHub from '../../icons/GitHub';
import { useUser } from '../../UserContext';
import s from './Footer.module.css';
import cn from 'classnames';

export default function Footer() {

  const { user } = useUser();

  return (
    <footer className="mx-auto max-w-8xl px-6 bg-primary-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-accents-7 py-12 text-primary transition-colors duration-150 bg-primary-2">
        <div className="col-span-1 lg:col-span-2">
          <Link href="/">
            <a className="flex flex-initial items-center font-bold md:mr-24">
              <span className={cn("mr-4")}>
                <Logo className={s.logo} />
              </span>
              <span>STAMPER</span>
            </a>
          </Link>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="/">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Home
                </a>
              </Link>
            </li>
            {
              !user && (
                <li className="py-3 md:py-0 md:pb-4">
                  <Link href="/pricing">
                    <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                      Pricing
                    </a>
                  </Link>
                </li>
              )
            }
            {
              user && (
                <li className="py-3 md:py-0 md:pb-4">
                  <Link href="/account">
                    <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                      Account
                    </a>
                  </Link>
                </li>
              )
            }
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="/">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Privacy Policy
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="/">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Terms of Use
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="py-12 flex flex-col md:flex-row justify-between items-center space-y-4 bg-primary-2">
        <div className="flex items-center">
          <span className="text-primary">Made by&nbsp;</span>
          <a href="https://www.twitter.com/vitHoracek" className="font-semibold" aria-label="Vit horacek Twitter link">
            Vít Horáček
          </a>
        </div>
      </div>
    </footer>
  );
}
