import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/initSupabase';
import { useUser } from '../components/UserContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/icons/Logo';

const SignUp = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const router = useRouter();
  const { signUp } = useUser();

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({});
    const { error, user } = await signUp({ email, password });
    if (error) {
      setMessage({ type: 'error', content: error.message });
    } else {
      if (user) {
        await supabase
          .from('users')
          .update({
            // full_name: name,
            cafe: false
          })
          .eq('id', user.id);
        const { data, error } = await supabase
          .from('drinkers')
          .insert({
            id: user.id,
            name,
          });
        setUser(user);
      } else {
        setMessage({
          type: 'note',
          content: 'Check your email for the confirmation link.'
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      router.replace('/account');
    }
  }, [user]);

  return (
    <form
      onSubmit={handleSignup}
      className="w-80 flex flex-col justify-between p-3 max-w-lg m-auto my-16 sm:my-64"
    >
      <div className="flex justify-center flex-col items-center pb-12 ">
        <Logo inverted={true} />
        <div className="text-3xl pt-8 font-bold">
          Coffee lover signup
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        {message.content && (
          <div
            className={`${
              message.type === 'error' ? 'text-red' : 'text-accents-7'
            } border ${
              message.type === 'error' ? 'border-red' : 'border-accents-7'
            } p-3`}
          >
            {message.content}
          </div>
        )}
        <Input placeholder="Name" onChange={setName} />
        <Input type="email" placeholder="Email" onChange={setEmail} required />
        <Input type="password" placeholder="Password" onChange={setPassword} />
        <div className="pt-2 w-full flex flex-col">
          <Button
            variant="slim"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Sign up
          </Button>
        </div>

        <span className="pt-1 text-center text-sm">
          <span className="text-accents-7">Do you have an account?</span>
          {` `}
          <Link href="/signin">
            <a className="text-accent-9 font-bold hover:underline cursor-pointer">
              Sign in.
            </a>
          </Link>
        </span>

        <span className="pt-12 text-center text-white text-xl">
          Are you a café?
        </span>
        
        <Link href="/signup-cafe">
          <a>
            <div
              className="mt-2 block w-full max-w-md mx-auto rounded-md py-2 px-6 text-normal font-bold text-accents-1 text-center bg-accents-8 transition-colors duration-200 hover:bg-accents-9"
              >
              Signup here
            </div> 
          </a>
        </Link>

      </div>
    </form>
  );
};

export default SignUp;
