import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useUser } from '@/context/UserContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useMobile } from '@/hooks/use-mobile';

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  active: boolean;
};

const NavItem = ({ href, icon, label, active }: NavItemProps) => (
  <Link href={href}>
    <a
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
        active
          ? 'bg-primary-50 text-primary-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="material-icons mr-3 text-primary-500">{icon}</span>
      {label}
    </a>
  </Link>
);

const Sidebar = () => {
  const { user } = useUser();
  const [location] = useLocation();
  const isOnline = useOnlineStatus();
  const isMobile = useMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { href: '/', icon: 'dashboard', label: 'Dashboard' },
    { href: '/lessons', icon: 'auto_stories', label: 'My Lessons' },
    { href: '/quizzes', icon: 'quiz', label: 'Quizzes' },
    { href: '/achievements', icon: 'emoji_events', label: 'Achievements' },
    { href: '/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
    { href: '/downloads', icon: 'download', label: 'Downloads' },
  ];

  // Mobile navigation bar
  const MobileNav = () => (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="material-icons text-primary-500">school</span>
        <h1 className="font-nunito font-bold text-xl text-primary-700">EduAI</h1>
      </div>
      <button
        onClick={toggleSidebar}
        className="text-gray-500 focus:outline-none"
      >
        <span className="material-icons">menu</span>
      </button>
    </div>
  );

  return (
    <>
      <MobileNav />
      
      <div
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } md:flex flex-col w-64 bg-white border-r border-gray-200 h-full overflow-y-auto`}
      >
        <div className="p-4 flex items-center space-x-2">
          <span className="material-icons text-primary-500 text-3xl">school</span>
          <h1 className="font-nunito font-bold text-2xl text-primary-700">EduAI</h1>
        </div>
        
        {/* User Profile */}
        {user && (
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback colorVariant="primary">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">Grade {user.grade}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={location === item.href}
            />
          ))}
        </nav>
        
        {/* Online Status Indicator */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              {isOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
              )}
            </span>
            <span className={`text-sm font-medium ${
              isOnline ? 'text-success-600' : 'text-gray-600'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
