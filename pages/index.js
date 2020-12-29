import { supabase } from '../utils/initSupabase';
import cn from 'classnames';
import Link from 'next/link';
import { useUser } from '../components/UserContext';
import { getCoffeesStatus } from '../utils/helpers';
import Me from '../components/Me';

export default function Index({ products }) {

  const { user, session, userLoaded, subscription, userDetails } = useUser();

  if (null) {
    return <Me products={products} />
  }

  return (
    <section className="bg-primary pb-12">
      <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl mb-6 font-extrabold text-white sm:text-center sm:text-6xl">
            Stamper<br />
          </h1>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Get rid of the paper coffee cards! 
          </p>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Simply have all of them here, digitally!
          </p>
        </div>
        <div className="my-16 w-full max-w-md mx-auto flex flex-col">

          <div
            className={cn(
              'rounded-lg shadow-sm divide-y divide-accents-2 bg-primary-2'
            )}
            >
            <div className="p-6">
              <div className="flex justify-between items-center h-8">

                <h2 className="text-3xl leading-6 font-extrabold text-white">
                  Your favourite café
                </h2>
                
              </div>
              {/* <p className="mt-4 text-accents-5">{"Description of the product"}</p> */}
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <span className="text-5xl font-extrabold white">
                    3&nbsp;
                  </span>
                  <span className="text-base font-extrabold white">
                    out of 10
                  </span>
                </div>
                <div>

                <span className="text-base font-medium text-accents-8">
                <b className="font-extrabold">{15}</b>&nbsp;coffees all-time
                </span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-5 gap-4 w-full justify-self-stretch">
                {
                  getCoffeesStatus(3)
                }
              </div>
                
            </div>
          </div>

        </div>

        <Link href="/signup">
          <a>
            <div
              className="mt-8 block w-full max-w-md mx-auto rounded-md py-4 px-6 text-2xl font-bold text-accents-2 text-center bg-accents-7 transition-colors duration-200 hover:bg-accents-8"
              >
              Sign up!
            </div> 
          </a>
        </Link>

        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl mt-16 sm:mt-24 mb-6 font-extrabold text-white sm:text-center sm:text-5xl">
            Are you café?
          </h1>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Adopt this simple contactless solution and make life of your customers even easier. 
          </p>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Try the app for free!
          </p>
        </div>

        <Link href="/pricing">
          <a>
            <div
              className="mt-8 block w-full max-w-md mx-auto rounded-md py-4 px-6 text-2xl font-bold text-accents-2 text-center bg-accents-7 transition-colors duration-200 hover:bg-accents-8"
              >
              Checkout the plans!
            </div> 
          </a>
        </Link>

      </div>
    </section>
  );
}

export async function getStaticProps() {
  // Load all active products and prices at build time.
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices', ascending: false });
  if (error) console.log(error.message);


  return {
    props: {
      products: products ?? []
    },
    // Refetch and rebuild pricing page every minute.
    revalidate: 60
  };
}
