export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <h1>Hello there how are you?</h1>
      <body>{children}</body>
    </html>
  )
}
