import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import { getCurrentUser, getActivityData, getGoals, ActivityRecord } from '../utils/storage';

export default function Analytics() {
  const [activityData, setActivityData] = useState<ActivityRecord[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ week: string; actual: number; target: number }[]>([]);
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const activity = getActivityData(user.id);
      setActivityData(activity);

      generateHeatmapData(activity);
      generateWeeklyData(activity);
    }
  }, []);

  const generateHeatmapData = (activity: ActivityRecord[]) => {
    const data: { date: string; count: number }[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const record = activity.find(a => a.date === dateStr);
      data.push({
        date: dateStr,
        count: record ? record.tasksCompleted : 0,
      });
    }

    setHeatmapData(data);
  };

  const generateWeeklyData = (activity: ActivityRecord[]) => {
    const weeks: { week: string; actual: number; target: number }[] = [];
    const today = new Date();

    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7) - today.getDay());

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekData = activity.filter(a => {
        const activityDate = new Date(a.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });

      const totalTasks = weekData.reduce((sum, d) => sum + d.tasksCompleted, 0);

      weeks.push({
        week: `Week ${12 - i}`,
        actual: totalTasks,
        target: 20,
      });
    }

    setWeeklyData(weeks);
  };

  const getHeatmapColor = (count: number): string => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-green-200';
    if (count <= 4) return 'bg-green-400';
    if (count <= 6) return 'bg-green-600';
    return 'bg-green-800';
  };

  const getMonthLabel = (index: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - (364 - index));
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return index % 30 === 0 ? month : '';
  };

  const totalTasks = activityData.reduce((sum, d) => sum + d.tasksCompleted, 0);
  const totalGoalsCompleted = activityData.reduce((sum, d) => sum + d.goalsCompleted, 0);
  const activeStreak = calculateCurrentStreak(activityData);
  const longestStreak = calculateLongestStreak(activityData);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your performance and progress over time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Tasks</span>
              <Target className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalTasks}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Goals Completed</span>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalGoalsCompleted}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Current Streak</span>
              <Calendar className="text-orange-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{activeStreak}</p>
            <p className="text-sm text-gray-500 mt-1">days</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Longest Streak</span>
              <Calendar className="text-purple-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{longestStreak}</p>
            <p className="text-sm text-gray-500 mt-1">days</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Activity Heatmap</h2>
          <p className="text-sm text-gray-600 mb-4">Your task completion activity over the past year</p>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid grid-cols-[repeat(53,_minmax(12px,_1fr))] gap-1">
                {heatmapData.map((day, index) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 rounded-sm ${getHeatmapColor(day.count)} hover:ring-2 hover:ring-purple-500 cursor-pointer transition-all`}
                    title={`${day.date}: ${day.count} tasks`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-gray-100 rounded-sm" />
                    <div className="w-3 h-3 bg-green-200 rounded-sm" />
                    <div className="w-3 h-3 bg-green-400 rounded-sm" />
                    <div className="w-3 h-3 bg-green-600 rounded-sm" />
                    <div className="w-3 h-3 bg-green-800 rounded-sm" />
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Performance</h2>
          <p className="text-sm text-gray-600 mb-6">Target vs Actual task completion over the past 12 weeks</p>

          <div className="space-y-4">
            {weeklyData.map((week, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">{week.week}</span>
                  <span className="text-gray-800 font-bold">
                    {week.actual} / {week.target} tasks
                  </span>
                </div>
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gray-300 rounded-lg"
                    style={{ width: `${(week.target / 30) * 100}%` }}
                  />
                  <div
                    className={`absolute top-0 left-0 h-full rounded-lg transition-all duration-500 ${
                      week.actual >= week.target
                        ? 'bg-gradient-to-r from-green-400 to-green-600'
                        : 'bg-gradient-to-r from-blue-400 to-purple-600'
                    }`}
                    style={{ width: `${(week.actual / 30) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow">
                      {Math.round((week.actual / week.target) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Performance Insights</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              {totalTasks > 0
                ? `You've completed ${totalTasks} tasks and achieved ${totalGoalsCompleted} goals. Keep up the great work!`
                : "Start completing tasks to see your analytics!"}
            </p>
            {activeStreak > 0 && (
              <p>You're on a {activeStreak}-day streak. Stay consistent to keep it going!</p>
            )}
            {longestStreak > 0 && (
              <p>Your longest streak was {longestStreak} days. Can you beat it?</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateCurrentStreak(activity: ActivityRecord[]): number {
  if (activity.length === 0) return 0;

  const sortedActivity = [...activity].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  for (const record of sortedActivity) {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);

    if (recordDate.getTime() === currentDate.getTime() && record.tasksCompleted > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (recordDate.getTime() < currentDate.getTime()) {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(activity: ActivityRecord[]): number {
  if (activity.length === 0) return 0;

  const sortedActivity = [...activity].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const record of sortedActivity) {
    if (record.tasksCompleted === 0) continue;

    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);

    if (lastDate === null) {
      currentStreak = 1;
    } else {
      const diffTime = recordDate.getTime() - lastDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    lastDate = recordDate;
  }

  return Math.max(longestStreak, currentStreak);
}
