import { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from '../utils/initSupabase';

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [userLoaded, setUserLoaded] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [userOrders, setUserOrders] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get the user details.
  const getUserDetails = () => supabase.from('users').select('*').single();

  const getDrinkersCafes = () => supabase.from('orders').select(`
    id,
    u_cafe:cafe ( * ),
    u_drinker:drinker ( * )
  `).match({
    drinker: user.id
  });


  // Get the user's trialing or active subscription.
  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

  useEffect(() => {
    if (user) {
      Promise.allSettled([getUserDetails(), getSubscription(), getDrinkersCafes()]).then(
        (results) => {
          setUserDetails(results[0].value.data);
          setSubscription(results[1].value.data);
          setUserOrders(results[2].value.data);
          setUserLoaded(true);
        }
      );
    }
  }, [user]);

  const sortOders = (fOrders) => {
    if (!fOrders) return null

    return Object.values(fOrders).sort((a,b) => {
      return b.length - a.length
    })
  }


  const flattenOrders = (orders) => {
    if (!orders) return null

    const flattened = orders.reduce((all_orders, order) => {
      console.log('all_orders[order.u_cafe.id]: ', all_orders)
      if (!all_orders[order.u_cafe.id]) {
        all_orders[order.u_cafe.id] = [order]
        return all_orders
      } else {

        all_orders[order.u_cafe.id] = [...all_orders[order.u_cafe.id], order]

        return all_orders
      }
    }, {})

    return sortOders(flattened)
  }
  
  const value = {
    session,
    user,
    userDetails,
    userLoaded,
    userOrders: flattenOrders(userOrders),
    subscription,
    signIn: (options) => supabase.auth.signIn(options),
    signUp: (options) => supabase.auth.signUp(options),
    signOut: () => {
      setUserDetails(null);
      setSubscription(null);
      return supabase.auth.signOut();
    }
  };
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
