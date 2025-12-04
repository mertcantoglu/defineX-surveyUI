import { Outlet, Link } from "react-router-dom"

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-4 py-3 flex justify-between">
        <Link to="/" className="font-semibold">Survey App</Link>

        <div className="flex gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
