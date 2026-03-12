import { useState, useEffect } from 'react';
import { Plus, Calendar, Flame, Target, Trash2, CreditCard as Edit2, Check, X } from 'lucide-react';
import {
  getCurrentUser,
  getGoals,
  saveGoals,
  recordActivity,
  updateGoalStreak,
  getDaysLeft,
  getProgressPercentage,
  Goal,
  Task,
} from '../utils/storage';
import { triggerConfetti } from '../utils/confetti';

export default function MyGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    endDate: '',
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const userGoals = getGoals(user.id);
      setGoals(userGoals);
    }
  }, []);

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.endDate) return;

    const user = getCurrentUser();
    if (!user) return;

    const goal: Goal = {
      id: Date.now().toString(),
      userId: user.id,
      title: newGoal.title,
      description: newGoal.description,
      endDate: newGoal.endDate,
      tasks: [],
      createdAt: new Date().toISOString(),
      completed: false,
      currentStreak: 0,
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    saveGoals(user.id, updatedGoals);

    setNewGoal({ title: '', description: '', endDate: '' });
    setShowNewGoal(false);
  };

  const handleAddTask = (goalId: string) => {
    if (!newTask.trim()) return;

    const user = getCurrentUser();
    if (!user) return;

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const task: Task = {
          id: Date.now().toString(),
          text: newTask,
          completed: false,
        };
        return { ...goal, tasks: [...goal.tasks, task] };
      }
      return goal;
    });

    setGoals(updatedGoals);
    saveGoals(user.id, updatedGoals);
    setNewTask('');
    setShowTaskInput(null);
  };

  const handleToggleTask = (goalId: string, taskId: string) => {
    const user = getCurrentUser();
    if (!user) return;

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedTasks = goal.tasks.map(task => {
          if (task.id === taskId) {
            const wasCompleted = task.completed;
            const nowCompleted = !wasCompleted;

            if (nowCompleted && !wasCompleted) {
              triggerConfetti();
              recordActivity(user.id, 1, 0);
              task.completedDate = new Date().toISOString();
            } else if (!nowCompleted && wasCompleted) {
              recordActivity(user.id, -1, 0);
              delete task.completedDate;
            }

            return { ...task, completed: nowCompleted };
          }
          return task;
        });

        let updatedGoal = { ...goal, tasks: updatedTasks };

        if (updatedTasks.every(t => t.completed) && updatedTasks.length > 0) {
          updatedGoal = updateGoalStreak(updatedGoal);
        }

        const allCompleted = updatedTasks.length > 0 && updatedTasks.every(t => t.completed);
        if (allCompleted && !goal.completed) {
          updatedGoal.completed = true;
          updatedGoal.completedAt = new Date().toISOString();
          recordActivity(user.id, 0, 1);
          triggerConfetti();
        } else if (!allCompleted && goal.completed) {
          updatedGoal.completed = false;
          delete updatedGoal.completedAt;
          recordActivity(user.id, 0, -1);
        }

        return updatedGoal;
      }
      return goal;
    });

    setGoals(updatedGoals);
    saveGoals(user.id, updatedGoals);
  };

  const handleDeleteGoal = (goalId: string) => {
    const user = getCurrentUser();
    if (!user) return;

    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    saveGoals(user.id, updatedGoals);
  };

  const handleDeleteTask = (goalId: string, taskId: string) => {
    const user = getCurrentUser();
    if (!user) return;

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, tasks: goal.tasks.filter(task => task.id !== taskId) };
      }
      return goal;
    });

    setGoals(updatedGoals);
    saveGoals(user.id, updatedGoals);
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Goals</h1>
            <p className="text-gray-600">Track and manage your goals</p>
          </div>
          <button
            onClick={() => setShowNewGoal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>New Goal</span>
          </button>
        </div>

        {showNewGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Goal</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="e.g., Learn Spanish"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    rows={3}
                    placeholder="What do you want to achieve?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newGoal.endDate}
                    onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCreateGoal}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Create Goal
                </button>
                <button
                  onClick={() => setShowNewGoal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Goals ({activeGoals.length})</h2>
          {activeGoals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGoals.map(goal => (
                <div key={goal.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 mb-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar size={16} />
                      <span>{getDaysLeft(goal.endDate)} days left</span>
                    </div>
                    <div className="flex items-center space-x-1 text-orange-600">
                      <Flame size={16} />
                      <span>{goal.currentStreak} day streak</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-gray-800">{getProgressPercentage(goal)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(goal)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {goal.tasks.map(task => (
                      <div
                        key={task.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                      >
                        <button
                          onClick={() => handleToggleTask(goal.id, task.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-purple-500'
                          }`}
                        >
                          {task.completed && <Check size={14} className="text-white" />}
                        </button>
                        <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.text}
                        </span>
                        <button
                          onClick={() => handleDeleteTask(goal.id, task.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}

                    {showTaskInput === goal.id ? (
                      <div className="flex space-x-2 mt-2">
                        <input
                          type="text"
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTask(goal.id)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                          placeholder="Enter task..."
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddTask(goal.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setShowTaskInput(null);
                            setNewTask('');
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowTaskInput(goal.id)}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-all flex items-center justify-center space-x-2 mt-2"
                      >
                        <Plus size={16} />
                        <span className="text-sm">Add Task</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No active goals yet. Create your first goal to get started!</p>
              <button
                onClick={() => setShowNewGoal(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Create Goal
              </button>
            </div>
          )}
        </div>

        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Completed Goals ({completedGoals.length})</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.map(goal => (
                <div key={goal.id} className="bg-green-50 rounded-2xl p-6 shadow-lg border-2 border-green-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-gray-600 text-sm">{goal.description}</p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Check size={24} className="text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-green-700 font-medium">
                    Completed on {new Date(goal.completedAt || '').toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
