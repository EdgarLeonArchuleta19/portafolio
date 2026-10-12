import Header from './Header'
import Footer from './Footer'

export default function MainLayout({ ownerName, children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer ownerName={ownerName} />
    </div>
  )
}
