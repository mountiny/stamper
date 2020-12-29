import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postData } from '../utils/helpers';
import { getStripe } from '../utils/initStripejs';
import { useUser } from '../components/UserContext';
import Button from './ui/Button';

export default function Pricing({ products }) {
  const [billingInterval, setBillingInterval] = useState('month');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session, userLoaded, subscription, userDetails } = useUser();

  const handleCheckout = async (price) => {
    setLoading(true);
    if (!session) {
      router.push('/signin');
      return;
    }
    if (subscription) {
      router.push('/account');
      return;
    }
    const { sessionId, error: apiError } = await postData({
      url: '/api/createCheckoutSession',
      data: { price },
      token: session.access_token
    });
    if (apiError) return alert(apiError.message);
    const stripe = await getStripe();
    const { error: stripeError } = stripe.redirectToCheckout({ sessionId });
    if (stripeError) alert(error.message);
    setLoading(false);
  };

  console.log('details: ', userDetails)

  if (!products.length)
    return (
      <section className="bg-primary pb-16">
        <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-6xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-accents-7 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );

  return (
    <section className="bg-primary pb-16">
      <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing<br />
          </h1>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
          Use this app instead of unnecessary paper coffee cards.
          </p>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
          Ten out of ten turtles thank you.
          </p>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
          You get plus 10 karma points for helping the planet.
          </p>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
          The app is being made by one <Link href="https://www.twitter.com/vitHoracek"><a className="font-extrabold text-white">developer</a></Link> studying at university.
          </p>
          <div className="relative self-center mt-6 bg-primary-2 rounded-lg p-0.5 flex sm:mt-8 border border-accents-0">
            <button
              onClick={() => setBillingInterval('month')}
              type="button"
              className={`${
                billingInterval === 'month'
                  ? 'relative w-1/2 bg-accents-1 border-accents-0 shadow-sm text-white'
                  : 'ml-0.5 relative w-1/2 border border-transparent text-accents-4'
              } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accents-7 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              type="button"
              className={`${
                billingInterval === 'year'
                  ? 'relative w-1/2 bg-accents-1 border-accents-0 shadow-sm text-white'
                  : 'ml-0.5 relative w-1/2 border border-transparent text-accents-7'
              } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accents-7 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
            >
              Yearly billing
            </button>
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
          {products.map((product) => {
            const price = product.prices.find(
              (price) => price.interval === billingInterval
            );
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency,
              minimumFractionDigits: 0
            }).format(price.unit_amount / 100);
            return (
              <div
                key={product.id}
                className={cn(
                  'rounded-lg shadow-sm divide-y divide-accents-2 bg-primary-2',
                  {
                    'border border-accents-8': subscription
                      ? product.name === subscription?.prices?.products.name
                      : product.name === 'Freelancer'
                  }
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl leading-6 font-semibold text-white">
                    {product.name}
                  </h2>
                  <p className="mt-4 text-accents-5">{product.description}</p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold white">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-accents-8">
                      &nbsp;/ {billingInterval}
                    </span>
                  </p>
                  <Button
                    variant="slim"
                    type="button"
                    disabled={session && !userLoaded}
                    loading={loading}
                    onClick={() => handleCheckout(price.id)}
                    className="mt-8 block w-full rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                  >
                    {product.name === subscription?.prices?.products.name
                      ? 'Manage'
                      : 'Subscribe'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* <div>
          <p className="mt-24 text-xs uppercase text-accents-7 text-center font-bold tracking-widest">
            Join these cafés in saving trees
          </p>
          <div className="flex flex-col items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
            <div className="flex items-center justify-start">
              <a href="https://nextjs.org" aria-label="Next.js Link">
                <img
                  src="/nextjs.svg"
                  alt="Next.js Logo"
                  className="h-12 text-primary"
                />
              </a>
            </div>
            
          </div>
        </div> */}
      </div>
    </section>
  );
}
