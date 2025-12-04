import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, LogOut, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import logo from "../assets/images/logo.png"

export default function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* logo and brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="logo" 
                  className="h-9 w-auto transition-transform group-hover:scale-105" 
                />
              </div>
            </Link>

            {/* navigation links */}
            <div className="flex items-center gap-1">
              <Link to="/dashboard">
                <Button
                  variant={isActive("/dashboard") ? "default" : "ghost"}
                  size="sm"
                  className={`
                    gap-2 font-medium transition-all
                    ${isActive("/dashboard") 
                      ? "bg-slate-800 text-white hover:bg-slate-700" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }
                  `}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Panel</span>
                </Button>
              </Link>

              <Link to="/surveys/create">
                <Button
                  variant={isActive("/surveys/create") ? "default" : "ghost"}
                  size="sm"
                  className={`
                    gap-2 font-medium transition-all
                    ${isActive("/surveys/create") 
                      ? "bg-slate-800 text-white hover:bg-slate-700" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }
                  `}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Anket Oluştur</span>
                </Button>
              </Link>

              {/* divider */}
              <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block" />

              {/* logout button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Çıkış</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

    </div>
  )
}
