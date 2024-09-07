export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <h1>hai</h1>
        <body>{children}</body>
      </html>
    )
  }