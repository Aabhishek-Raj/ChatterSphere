export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        <h1>i am dashboard layout</h1>
        {/* Include shared UI here e.g. a header or sidebar */}
        <nav></nav>
   
        {children}
      </section>
    )
  }