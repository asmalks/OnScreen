import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast({
                title: 'Error logging in',
                description: error.message,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: 'Logged in successfully',
            });
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            toast({
                title: 'Error signing up',
                description: error.message,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Success',
                description: 'Check your email for the confirmation link',
            });
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <Input
                                type="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mb-2"
                            />
                        </div>
                        <div>
                            <Input
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            className="group relative flex w-full justify-center"
                            disabled={loading}
                        >
                            Sign in
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="group relative flex w-full justify-center"
                            disabled={loading}
                            onClick={handleSignUp}
                        >
                            Sign up
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
