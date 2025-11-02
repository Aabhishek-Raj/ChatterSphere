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
import { useRegisterMutation } from '@/store/reducers/auth/authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/store/reducers/auth/authSlice'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

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
})

const RegisterPage = () => {
  const router = useRouter()

  const [register, { isLoading }] = useRegisterMutation()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const loading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userData = await register(values).unwrap()
      form.reset()
      // router.refresh()
      // window.location.reload()
      redirect('/login')
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
          <h2 className="text-4xl font-bold py-4">Join us</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold ">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    className="bg-zinc-300/50 border-0 py-6 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder="Enter your name"
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
                <FormLabel className="uppercase text-xs font-bold ">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={loading}
                    className="bg-zinc-300/50 border-0 py-6 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder="Enter your email"
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
                    className="bg-zinc-300/50 border-0 py-6 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" disabled={loading}>
            Create
          </Button>
          <Separator />
          <footer className="flex flex-col items-center text-center">
            <p className="text-xs mb-2">Already have an accound?</p>
            <Link href="/login">
              <Button type="submit" size="sm" className="max-w-60 bg-blue-400 cursor-pointer">
                Log in
              </Button>
            </Link>
          </footer>
        </div>
      </form>
    </Form>
  )
}

export default RegisterPage
