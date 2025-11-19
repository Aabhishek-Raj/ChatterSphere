'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { redirect, useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import apiService from '@/app/services/apiServices'
import { useLoginMutation } from '@/store/reducers/auth/authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/store/reducers/auth/authSlice'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().min(1, {
    message: 'email is required',
  }),
  password: z.string().min(1, {
    message: 'password is required',
  }),
})

const LoginPage = () => {
  const router = useRouter()

  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userData = await login(values).unwrap()
      console.log(userData)
      dispatch(setCredentials({ ...userData, user: values.email }))
      console.log('Dispached:--', { ...userData, user: values.email })
      // const saveCoreUser = await apiService.get('/api/auth/registerUser', values)
      // const response = await signup(values)
      form.reset()
      router.push('/chat')
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-center mt-8"
      >
        <div className="flex flex-col w-[450px] gap-6">
          <h2 className="text-4xl font-bold py-3">Log in</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold w-full">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    className="bg-zinc-300/50 border-0 py-6 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
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
                <FormLabel className="uppercase text-xs font-bold ">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    className="bg-zinc-300/50 border-0 py-6 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} size="lg" className="cursor-pointer">
            Log in
          </Button>

          <Separator />
          <footer className="flex flex-col items-center text-center">
            <p className="text-xs mb-2">Not a member yet?</p>
            <Link href="/register">
              <Button type="submit" size="sm" className="max-w-60 bg-blue-400 cursor-pointer">
                Create account
              </Button>
            </Link>
          </footer>
        </div>
      </form>
    </Form>
  )
}

export default LoginPage
