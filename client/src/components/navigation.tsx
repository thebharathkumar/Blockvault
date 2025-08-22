import { Link, useLocation } from "wouter";
import { Shield, Upload, Search, LayoutDashboard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Verify", icon: Search },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Shield className="text-primary text-2xl mr-3" />
              <span className="text-xl font-bold text-gray-900">BlockVault</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-600 hover:text-primary"
                      }`}
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Made by Bharath</span>
            <Button 
              className="bg-primary text-white hover:bg-blue-700"
              data-testid="button-connect-wallet"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
