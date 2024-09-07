import { Metadata } from 'next'
import Link from 'next/link'
 
export const metadata: Metadata = {
  title: 'Fana',
}
 
export default function Page() {
  const content = (<div>
    <h1>Hello, Next.js!</h1>
    <Link href="/dashboard">Dashboard</Link>
  </div>)
  return content
}