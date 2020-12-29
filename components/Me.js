import { supabase } from '../utils/initSupabase';
import cn from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCoffeesStatus } from '../utils/helpers';
import { useUser } from './UserContext';
import LoadingDots from './ui/LoadingDots';
import QRCode from "qrcode.react"

export default function Me({ products }) {
  const [billingInterval, setBillingInterval] = useState('month');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, session, userLoaded, subscription, userOrders, userDetails } = useUser();

  useEffect(() => {
    if (userLoaded && !user) {
      router.replace('/');
    }

  }, [user]);

  console.log('userDetails :>> ', userDetails);
  console.log('userOrders :>> ', userOrders);
  

  if (user) {
    return (
      <section className="bg-primary">
        <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center mb-16">
            <QRCode value={`${process.env.VERCEL_URL || "http://localhost:3000/"}new-order?id=${userDetails?.id}`} bgColor="#306060" fgColor="#ffffff" size={256} />
          </div>
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-4xl font-extrabold mb-16 text-white text-center sm:text-6xl">
              Show your barista! <br />
            </h1>
            <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
              Collect the coffees to get some for free!
            </p>
            <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
              Tell your favourite café about <a className="text-accents-7 font-medium transition-colors duration-250 hover:text-accents-9" href="https://twitter.com/vitHoracek">Stamper</a> to stop wasting paper and use modern & simple solution.
            </p>
           
          </div>

          <div className="max-w-6xl mx-auto pt-16 pb-12 sm:py-24 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-white text-center sm:text-6xl">
              Your cards
            </h1>
          </div>


          <div className="mt-4 space-y-4 sm:space-y-0 grid md:grid-cols-2 gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
            {
              userOrders && 
              userOrders.length > 0 ?
                userOrders.map((order, cafe_id) => {

                  return (
                    <Link 
                      key={cafe_id}
                      href="/me"
                      >
                        <a>
                          <div
                            className={cn(
                              'rounded-lg shadow-sm divide-y divide-accents-2 bg-primary-2'
                            )}
                          >
                            <div className="p-6">
                              <div className="flex justify-between items-center h-8">

                                <h2 className="text-3xl leading-6 font-extrabold text-white">
                                  {order[0].u_cafe.name}

                                  
                                </h2>
                                {
                                  order[0].u_cafe.instagram && (

                                    <Link 
                                      href={order[0].u_cafe.instagram}
                                      >
                                      <a>
                                        <div className="px-2 py-2 relatve rounded-lg bg-primary transition-colors hover:bg-primary-2">
                                          <h3 className="text-lg leading-6 font-extrabold text-white">
                                              IG
                                          </h3>
                                        </div>
                                      </a>
                                    </Link>
                                  )
                                }
                              </div>
                              {/* <p className="mt-4 text-accents-5">{"Description of the product"}</p> */}
                              <div className="mt-4 flex justify-between items-end">
                                <div>
                                  <span className="text-5xl font-extrabold white">
                                    {order.length % 10 === 0 ? 10 : order.length % 10}&nbsp;
                                  </span>
                                  <span className="text-base font-extrabold white">
                                    out of 10
                                  </span>
                                </div>
                                <div>

                                <span className="text-base font-medium text-accents-8">
                                <b className="font-extrabold">{order.length}</b>&nbsp;coffee{order.length > 1 && "s"} all-time
                                </span>
                                </div>
                              </div>
                              <div className="mt-8 grid grid-cols-5 gap-4 w-full justify-self-stretch">
                                {
                                  getCoffeesStatus(order.length)
                                }
                              </div>

                              {
                                order.length % 10 === 0 && (
                                  <div
                                    className="mt-8 block w-full rounded-md py-2 px-4 text-sm font-semibold text-secondary text-center bg-accents-7"
                                  >
                                    Our hero! Enjoy this coffee for free!
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        </a>
                    </Link>
                  )
                })
               : (
                <>
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

                        <div
                          className="mt-8 block w-full rounded-md py-2 px-4 text-normal font-semibold text-secondary text-center bg-accents-7"
                        >
                          Tell your café about this app and let's waste less paper together!
                        </div>
                        
                    </div>
                  </div>
                </>
              )
            }
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
}

// export async function getStaticProps() {
//   // Load all active products and prices at build time.
//   const { data: products, error } = await supabase
//     .from('products')
//     .select('*, prices(*)')
//     .eq('active', true)
//     .eq('prices.active', true)
//     .order('metadata->index')
//     .order('unit_amount', { foreignTable: 'prices', ascending: false });
//   if (error) console.log(error.message);


//   return {
//     props: {
//       products: products.reverse() ?? []
//     },
//     // Refetch and rebuild pricing page every minute.
//     revalidate: 60
//   };
// }
