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
        <Button 
          onClick={() => navigate('/auth')}
          variant="outline"
          className="border-primary-600 text-primary-600 hover:bg-primary-50"
        >
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Learn Smarter, <span className="text-primary-600">Not Harder</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            JubunuAI is an adaptive learning platform that personalizes your educational journey with 
            AI-powered insights and engaging content tailored to your needs.
          </p>
          <div className="space-y-4 max-w-md">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg" 
              className="w-full sm:w-auto text-base px-6"
            >
              Get Started
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
      <section className="bg-gray-50 py-12 md:py-20">
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
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-white text-xl font-bold">JubunuAI</span>
              <p className="mt-2">Empowering education through technology</p>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} JubunuAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;