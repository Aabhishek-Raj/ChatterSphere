'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { redirect, useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import apiService from '@/app/services/apiServices';
import { useRegisterMutation } from '@/store/reducers/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/reducers/auth/authSlice';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'name is required',
  }),
  email: z.string().min(1, {
    message: 'email is required',
  }),
  password: z.string().min(1, {
    message: 'password is required',
  }),
});

const RegisterPage = () => {
  const router = useRouter();

  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values, 'values');
      const userData = await register(values).unwrap();
      form.reset();
      // router.refresh()
      // window.location.reload()
      redirect('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-100 space-y-8">
          <div className="h-100 space-y-8 px-6">
            <div className="h-100 flex flex-col gap-6 items-center justify-center text-center">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold ">Enter your Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter you Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold ">Enter your Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter you email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold ">
                      Enter Your Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="secondary" disabled={loading}>
                Create
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterPage;
