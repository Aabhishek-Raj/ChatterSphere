'use client'

import { selectCurrentToken, selectCurrentUser } from '@/store/reducers/auth/authSlice'
import Link from 'next/link'
import { useSelector } from 'react-redux'

export default function Page() {
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)

  const welcome = user ? `Welcome ${user}!` : 'Welcome!'
  const tokenAbbr = `${token?.slice(0, 9)}...`

  return (
    <section className="flex items-center justify-center flex-col">
      <h1 className="text-2xl text-fuchsia-600">{welcome}</h1>
      <p>
        Token: <span className="text-red-500"> {tokenAbbr} </span>
      </p>
      <p className="underline text-sky-600 mt-3">
        <Link href="/dashboard/followers">Go to followers list</Link>
      </p>
    </section>
  )
}
