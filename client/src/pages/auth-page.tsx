import { useState } from 'react';
import { Redirect, useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { insertUserSchema } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = insertUserSchema
  .extend({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      grade: 5,
      password: '',
      confirmPassword: '',
    },
  });
  
  // Redirect if already logged in - AFTER all hook calls!
  if (user) {
    return <Redirect to="/" />;
  }

  // Handle login submission
  const onLoginSubmit = (values: LoginValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: 'Login successful',
          description: 'Welcome back to LearnBright!',
        });
        navigate('/');
      },
      onError: (error) => {
        toast({
          title: 'Login failed',
          description: error.message || 'Please check your credentials and try again',
          variant: 'destructive',
        });
      },
    });
  };

  // Handle registration submission
  const onRegisterSubmit = (values: RegisterValues) => {
    // Remove confirmPassword as it's not part of the API schema
    const { confirmPassword, ...userData } = values;
    
    registerMutation.mutate(userData, {
      onSuccess: () => {
        toast({
          title: 'Registration successful',
          description: 'Your account has been created. Welcome to LearnBright!',
        });
        navigate('/');
      },
      onError: (error) => {
        toast({
          title: 'Registration failed',
          description: error.message || 'Please check your information and try again',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row items-center justify-center">
      {/* Login/Register Form */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-10 max-w-xl mx-auto">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'login'
                ? 'Sign in to your JubunuAI account'
                : 'Join JubunuAI to start your learning journey'}
            </CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <CardContent className="space-y-4 pt-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="yourusername" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              max={12} 
                              placeholder="e.g. 5" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Hero Section */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-primary-700 to-primary-900 p-6 md:p-10 flex-col justify-center">
        <div className="max-w-md mx-auto text-white space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">Welcome to JubunuAI</h1>
          
          <p className="text-primary-100 text-lg">
            Your personalized learning platform designed to make education engaging, interactive, and accessible.
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-3">
              <span className="material-icons text-primary-300 mt-1">school</span>
              <div>
                <h3 className="font-semibold">Personalized Learning</h3>
                <p className="text-primary-200 text-sm">Adaptive content that grows with your progress</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="material-icons text-primary-300 mt-1">psychology</span>
              <div>
                <h3 className="font-semibold">AI-Powered Assistance</h3>
                <p className="text-primary-200 text-sm">Get help from our intelligent tutor anytime</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="material-icons text-primary-300 mt-1">offline_bolt</span>
              <div>
                <h3 className="font-semibold">Learn Offline</h3>
                <p className="text-primary-200 text-sm">Download lessons to study anywhere, anytime</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="material-icons text-primary-300 mt-1">emoji_events</span>
              <div>
                <h3 className="font-semibold">Gamified Experience</h3>
                <p className="text-primary-200 text-sm">Earn badges and climb the leaderboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;