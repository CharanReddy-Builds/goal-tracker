import { useEffect, useState } from 'react';
import { Target, TrendingUp, Award, Flame } from 'lucide-react';
import { getCurrentUser, getGoals, getActivityData, Goal } from '../utils/storage';

export default function Dashboard() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [stats, setStats] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    totalTasks: 0,
    completedTasks: 0,
    progressPercentage: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const goals = getGoals(currentUser.id);
      const activityData = getActivityData(currentUser.id);

      const activeGoals = goals.filter(g => !g.completed);
      const completedGoals = goals.filter(g => g.completed);

      const totalTasks = goals.reduce((sum, goal) => sum + goal.tasks.length, 0);
      const completedTasks = goals.reduce((sum, goal) =>
        sum + goal.tasks.filter(task => task.completed).length, 0
      );

      const maxStreak = activeGoals.length > 0
        ? Math.max(...activeGoals.map(g => g.currentStreak || 0))
        : 0;

      setStats({
        totalGoals: goals.length,
        activeGoals: activeGoals.length,
        completedGoals: completedGoals.length,
        totalTasks,
        completedTasks,
        progressPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        currentStreak: maxStreak,
      });
    }
  }, []);

  const recentActivity = () => {
    if (!user) return [];
    const activityData = getActivityData(user.id);
    return activityData.slice(-7).reverse();
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">Here's your progress overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.activeGoals}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Active Goals</h3>
            <p className="text-sm text-gray-500 mt-1">{stats.completedGoals} completed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.progressPercentage}%</span>
            </div>
            <h3 className="text-gray-600 font-medium">Overall Progress</h3>
            <p className="text-sm text-gray-500 mt-1">{stats.completedTasks} of {stats.totalTasks} tasks</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <Flame className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.currentStreak}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Day Streak</h3>
            <p className="text-sm text-gray-500 mt-1">Keep it up!</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <Award className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.completedGoals}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Goals Achieved</h3>
            <p className="text-sm text-gray-500 mt-1">Total completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity().length > 0 ? (
                recentActivity().map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.tasksCompleted} tasks completed
                      </p>
                    </div>
                    {activity.tasksCompleted > 0 && (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No activity yet. Start completing tasks!</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-bold text-gray-800">{stats.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats.progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-600 font-medium mb-1">Total Tasks</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.totalTasks}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-600 font-medium mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-700">{stats.completedTasks}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <p className="text-sm text-purple-600 font-medium mb-2">Motivational Tip</p>
                <p className="text-gray-700">
                  {stats.currentStreak > 0
                    ? `Amazing! You're on a ${stats.currentStreak} day streak. Keep going!`
                    : 'Complete a task today to start building your streak!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
