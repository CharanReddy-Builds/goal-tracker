import { Target, TrendingUp, Calendar, Award, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onNavigate: () => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GoalTrack
            </h1>
          </div>
          <button
            onClick={onNavigate}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-6">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            Track Your Progress
          </span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
          Achieve Your Goals
          <br />
          One Step at a Time
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Transform your ambitions into achievements with our powerful goal tracking platform. Stay motivated, build streaks, and celebrate your progress.
        </p>
        <button
          onClick={onNavigate}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center space-x-2"
        >
          <span>Start Tracking Now</span>
          <ArrowRight size={20} />
        </button>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Target className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Set Goals</h3>
            <p className="text-gray-600">
              Create and organize your goals with deadlines and tasks
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your daily progress and watch your goals come to life
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Calendar className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Build Streaks</h3>
            <p className="text-gray-600">
              Stay consistent and build powerful daily habits
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Award className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Get Insights</h3>
            <p className="text-gray-600">
              Analyze your performance with beautiful charts and heatmaps
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose GoalTrack?
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Visual Progress Tracking</h4>
                  <p className="text-gray-600">See your progress with intuitive charts and heatmaps</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Streak Tracking</h4>
                  <p className="text-gray-600">Build momentum with daily streak counters</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Task Management</h4>
                  <p className="text-gray-600">Break down goals into actionable daily tasks</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Analytics Dashboard</h4>
                  <p className="text-gray-600">Get insights into your performance patterns</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Gamification</h4>
                  <p className="text-gray-600">Celebrate wins with animations and achievements</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">100% Private</h4>
                  <p className="text-gray-600">All data stored locally on your device</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of achievers tracking their goals and building better habits
          </p>
          <button
            onClick={onNavigate}
            className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Create Your Account
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 GoalTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
