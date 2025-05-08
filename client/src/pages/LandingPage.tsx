import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const LandingPage = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to dashboard if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Sign In Button */}
      <header className="w-full py-4 px-6 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <span className="text-primary-600 text-2xl font-bold">JubunuAI</span>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6 text-gray-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#students" className="hover:text-primary-600 transition-colors">For Students</a>
            <a href="#teachers" className="hover:text-primary-600 transition-colors">For Teachers</a>
          </nav>
          <Button 
            onClick={() => navigate('/auth')}
            variant="outline"
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row bg-gradient-to-br from-white via-primary-50 to-white">
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <div className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            AI-Powered Learning
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Learn Smarter, <span className="text-primary-600">Not Harder</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            JubunuAI is an adaptive learning platform that personalizes your educational journey with 
            AI-powered insights and engaging content tailored to your unique learning style and pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg" 
              className="w-full sm:w-auto text-base px-6"
            >
              Get Started
            </Button>
            <Button 
              onClick={() => navigate('/auth?mode=teacher')}
              variant="outline"
              size="lg" 
              className="w-full sm:w-auto text-base px-6 border-primary-600 text-primary-600"
            >
              Teacher Sign Up
            </Button>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 p-6 md:p-12 flex items-center">
          <div className="max-w-md mx-auto text-white space-y-8">
            <h2 className="text-3xl font-bold mb-6">Why Choose JubunuAI?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <span className="material-icons text-primary-300 text-2xl">school</span>
                <div>
                  <h3 className="text-xl font-semibold">Personalized Learning</h3>
                  <p className="text-primary-100">Adaptive content that grows with your progress and meets you where you are</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <span className="material-icons text-primary-300 text-2xl">psychology</span>
                <div>
                  <h3 className="text-xl font-semibold">AI-Powered Assistance</h3>
                  <p className="text-primary-100">Get help from our intelligent tutor anytime, anywhere</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <span className="material-icons text-primary-300 text-2xl">offline_bolt</span>
                <div>
                  <h3 className="text-xl font-semibold">Learn Offline</h3>
                  <p className="text-primary-100">Download lessons to study without an internet connection</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <span className="material-icons text-primary-300 text-2xl">emoji_events</span>
                <div>
                  <h3 className="text-xl font-semibold">Gamified Experience</h3>
                  <p className="text-primary-100">Earn badges and climb the leaderboard as you learn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Transforming Education</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <span className="material-icons text-primary-600 text-3xl mb-4">auto_stories</span>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Curriculum</h3>
              <p className="text-gray-600">Access a wide range of subjects and topics aligned with K-12 standards</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <span className="material-icons text-primary-600 text-3xl mb-4">insights</span>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your learning journey with detailed analytics and insights</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <span className="material-icons text-primary-600 text-3xl mb-4">devices</span>
              <h3 className="text-xl font-semibold mb-2">Cross-Device Access</h3>
              <p className="text-gray-600">Learn on any device, anytime, with seamless synchronization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Students Section */}
      <section id="students" className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <div className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                FOR STUDENTS
              </div>
              <h2 className="text-3xl font-bold mb-6">Personalized Learning Journey</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="material-icons text-primary-600 mr-3">check_circle</span>
                  <p className="text-gray-700">Interactive quizzes that adapt to your learning pace</p>
                </div>
                <div className="flex items-start">
                  <span className="material-icons text-primary-600 mr-3">check_circle</span>
                  <p className="text-gray-700">Earn badges and rewards as you master new concepts</p>
                </div>
                <div className="flex items-start">
                  <span className="material-icons text-primary-600 mr-3">check_circle</span>
                  <p className="text-gray-700">Download lessons for offline study at your convenience</p>
                </div>
                <div className="flex items-start">
                  <span className="material-icons text-primary-600 mr-3">check_circle</span>
                  <p className="text-gray-700">Ask questions anytime with our AI-powered digital assistant</p>
                </div>
                <div className="flex items-start">
                  <span className="material-icons text-primary-600 mr-3">check_circle</span>
                  <p className="text-gray-700">Track your progress with detailed analytics and insights</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/auth')}
                className="mt-8" 
                size="lg"
              >
                Start Learning
              </Button>
            </div>
            <div className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-lg">
              <div className="aspect-video bg-primary-100 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-icons text-primary-600 text-5xl mb-2">smart_display</span>
                    <p className="text-primary-800 font-medium">Interactive Learning Preview</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-primary-50 p-4 rounded-lg flex flex-col items-center text-center">
                  <span className="material-icons text-primary-600 text-3xl mb-2">quiz</span>
                  <h4 className="font-medium">Adaptive Quizzes</h4>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg flex flex-col items-center text-center">
                  <span className="material-icons text-primary-600 text-3xl mb-2">military_tech</span>
                  <h4 className="font-medium">Badge System</h4>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg flex flex-col items-center text-center">
                  <span className="material-icons text-primary-600 text-3xl mb-2">cloud_download</span>
                  <h4 className="font-medium">Offline Content</h4>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg flex flex-col items-center text-center">
                  <span className="material-icons text-primary-600 text-3xl mb-2">leaderboard</span>
                  <h4 className="font-medium">Progress Tracking</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section id="teachers" className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pl-12">
              <div className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                FOR TEACHERS
              </div>
              <h2 className="text-3xl font-bold mb-6">Powerful Teaching Tools</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="material-icons text-primary-600 mr-3">check_circle</span>
                  <p className="text-gray-700">Create and manage classes with ease</p>
                </div>
                <div className="flex items-start">
                  <span className="material-icons text-primary-600 mr-3">check_circle</span>
                  <p className="text-gray-700">Develop comprehensive lesson plans with AI assistance</p>
                </div>
                <div className="flex items-start">
                  <span className="material-icons text-primary-600 mr-3">check_circle</span>
                  <p className="text-gray-700">Assign and grade homework automatically</p>
                </div>
                <div className="flex items-start">
                  <span className="material-icons text-primary-600 mr-3">check_circle</span>
                  <p className="text-gray-700">Track student performance with detailed analytics</p>
                </div>
                <div className="flex items-start">
                  <span className="material-icons text-primary-600 mr-3">check_circle</span>
                  <p className="text-gray-700">Make announcements and communicate effectively</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/auth?mode=teacher')}
                className="mt-8" 
                size="lg"
              >
                Join as Teacher
              </Button>
            </div>
            <div className="w-full md:w-1/2">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold text-lg text-primary-800">Teacher Dashboard</h3>
                  <p className="text-gray-600 text-sm">Manage your classes and track student progress</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                    <span className="material-icons text-primary-600 mr-3">groups</span>
                    <div>
                      <h4 className="font-medium">Class Management</h4>
                      <p className="text-sm text-gray-600">Create and organize student groups</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                    <span className="material-icons text-primary-600 mr-3">assignment</span>
                    <div>
                      <h4 className="font-medium">Assignment Tools</h4>
                      <p className="text-sm text-gray-600">Create, distribute and grade assignments</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                    <span className="material-icons text-primary-600 mr-3">analytics</span>
                    <div>
                      <h4 className="font-medium">Performance Analytics</h4>
                      <p className="text-sm text-gray-600">Track student progress and identify areas for improvement</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                    <span className="material-icons text-primary-600 mr-3">campaign</span>
                    <div>
                      <h4 className="font-medium">Announcements</h4>
                      <p className="text-sm text-gray-600">Keep students informed with class announcements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials and stats */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by Educators and Students</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="p-4">
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <p className="text-gray-600">Dedicated Teachers</p>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <p className="text-gray-600">Interactive Lessons</p>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
          
          <div className="bg-primary-50 p-8 rounded-xl max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="material-icons text-yellow-500">star</span>
              ))}
            </div>
            <p className="text-gray-700 italic mb-4">
              "JubunuAI has transformed how I teach my 5th-grade class. The personalized learning paths and analytics have helped me identify and address learning gaps more effectively than ever before."
            </p>
            <div>
              <p className="font-medium">Ms. Johnson</p>
              <p className="text-sm text-gray-600">Elementary School Teacher</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-primary-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Join thousands of students who are already experiencing the future of education.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            variant="secondary" 
            size="lg"
            className="bg-white text-primary-800 hover:bg-primary-50"
          >
            Create Your Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-white text-xl font-bold">JubunuAI</span>
              </div>
              <p className="mb-4">Empowering education through AI technology and personalized learning experiences.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="material-icons">facebook</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="material-icons">twitter</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="material-icons">instagram</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="material-icons">youtube</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">For Students</h3>
              <ul className="space-y-2">
                <li><a href="#students" className="hover:text-white transition-colors">Learning Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Study Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Offline Learning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Achievement Badges</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">For Teachers</h3>
              <ul className="space-y-2">
                <li><a href="#teachers" className="hover:text-white transition-colors">Classroom Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lesson Planning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Student Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resource Library</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} JubunuAI. All rights reserved.
            </div>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;