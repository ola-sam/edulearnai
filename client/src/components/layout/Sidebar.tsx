import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  active: boolean;
};

const NavItem = ({ href, icon, label, active }: NavItemProps) => {
  // Consistent purple color scheme for all navigation items
  const colors = {
    bg: 'bg-purple-100',
    border: 'border-purple-500',
    text: 'text-purple-700',
    icon: 'text-purple-600',
    dot: 'bg-purple-500',
    ping: 'bg-purple-400'
  };

  return (
    <Link href={href}>
      <a
        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg relative transition-all duration-200 
          ${active
            ? `${colors.bg} ${colors.text} shadow-sm border-l-4 ${colors.border} pl-2 font-semibold`
            : `text-gray-700 hover:bg-opacity-70 hover:${colors.bg} hover:${colors.text} hover:border-l-4 hover:${colors.border} hover:pl-2`
          }`}
      >
        <div className={`flex items-center ${active ? 'transform scale-105' : ''}`}>
          <span className={`material-icons mr-3 transition-all duration-300 group-hover:${colors.icon} ${active ? colors.icon : 'text-gray-500'}`}>
            {icon}
          </span>
          <span className="transition-all duration-300">{label}</span>
        </div>
        {active && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.ping} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.dot}`}></span>
          </span>
        )}
      </a>
    </Link>
  );
};

const Sidebar = () => {
  const { user, logoutMutation } = useAuth();
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

  // Define navigation items
  const studentNavItems = [
    { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/lessons', icon: 'auto_stories', label: 'My Lessons' },
    { href: '/quizzes', icon: 'quiz', label: 'Quizzes' },
    { href: '/kids-code', icon: 'toys', label: 'KidsCode Studio' },
    { href: '/achievements', icon: 'emoji_events', label: 'Achievements' },
    { href: '/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
    { href: '/downloads', icon: 'download', label: 'Downloads' },
  ];
  
  // Define teacher-specific navigation items
  const teacherNavItems = [
    { href: '/teacher/dashboard', icon: 'space_dashboard', label: 'Teacher Dashboard' },
    { href: '/teacher/classes', icon: 'groups', label: 'My Classes' },
    { href: '/teacher/lesson-plans', icon: 'auto_stories', label: 'Lesson Plans' },
    { href: '/teacher/assignments', icon: 'assignment', label: 'Assignments' },
    { href: '/teacher/analytics', icon: 'analytics', label: 'Analytics' },
    { href: '/dashboard', icon: 'school', label: 'Student View' },
  ];
  
  // For teachers, only show teacher navigation with a link to student view
  // For students, show student navigation only
  const navItems = user?.isTeacher 
    ? teacherNavItems
    : studentNavItems;

  // Mobile navigation bar
  const MobileNav = () => (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="material-icons text-purple-500">school</span>
        <h1 className="font-nunito font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">JubunuAI</h1>
      </div>
      <div className="flex items-center space-x-3">
        {user && (
          <Avatar className="w-8 h-8 mr-1">
            <AvatarFallback colorVariant="primary" className="text-sm">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 p-1 rounded-md"
        >
          <span className="material-icons">{isSidebarOpen ? 'close' : 'menu'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <MobileNav />
      
      <div
        className={`${
          isSidebarOpen ? 'block fixed inset-0 z-20' : 'hidden'
        } md:static md:block md:z-0 md:flex flex-col md:w-64 bg-white border-r border-gray-200 h-full overflow-y-auto`}
      >
        {/* Mobile overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden -z-10"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Mobile close button */}
        {isMobile && (
          <div className="flex justify-end p-2 md:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
        )}
        <div className="p-4 flex items-center space-x-2">
          <span className="material-icons text-purple-500 text-3xl">school</span>
          <h1 className="font-nunito font-bold text-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">JubunuAI</h1>
        </div>
        
        {/* User Profile */}
        {user && (
          <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarFallback colorVariant="primary" className="text-lg">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-gray-800">
                  {user.firstName} {user.lastName}
                </p>
                <div className="flex items-center mt-1">
                  <span className="material-icons text-purple-500 text-xs mr-1">
                    {user.isTeacher ? 'person' : 'school'}
                  </span>
                  <div className="flex items-center">
                    <p className="text-xs font-medium text-purple-600">
                      {user.isTeacher ? 'Teacher' : `Grade ${user.grade}`}
                    </p>
                    {user.isTeacher && (
                      <span className="inline-flex ml-2 items-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                        Teacher
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          <div className="mb-2 px-3">
            <h2 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Main Menu</h2>
          </div>
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
        
        {/* Online Status and Logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="mb-2 px-1">
            <h2 className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Status</h2>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <span className="flex h-3 w-3 relative">
                {isOnline ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                )}
              </span>
              <span className={`text-sm font-medium ${
                isOnline ? 'text-purple-600' : 'text-gray-600'
              }`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {user && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center shadow-sm hover:bg-purple-50 hover:text-purple-600 transition-colors border-gray-200" 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <span className="material-icons mr-2 text-sm">logout</span>
                {logoutMutation.isPending ? 'Logging out...' : 'Sign out'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
