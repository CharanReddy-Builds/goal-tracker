export interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedDate?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  endDate: string;
  tasks: Task[];
  createdAt: string;
  completed: boolean;
  completedAt?: string;
  currentStreak: number;
  lastActivityDate?: string;
}

export interface ActivityRecord {
  date: string;
  goalsCompleted: number;
  tasksCompleted: number;
}

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const getGoals = (userId: string): Goal[] => {
  const goals = localStorage.getItem(`goals_${userId}`);
  return goals ? JSON.parse(goals) : [];
};

export const saveGoals = (userId: string, goals: Goal[]) => {
  localStorage.setItem(`goals_${userId}`, JSON.stringify(goals));
};

export const getActivityData = (userId: string): ActivityRecord[] => {
  const data = localStorage.getItem(`activity_${userId}`);
  return data ? JSON.parse(data) : [];
};

export const saveActivityData = (userId: string, data: ActivityRecord[]) => {
  localStorage.setItem(`activity_${userId}`, JSON.stringify(data));
};

export const recordActivity = (userId: string, tasksCompleted: number, goalsCompleted: number) => {
  const today = new Date().toISOString().split('T')[0];
  const activityData = getActivityData(userId);

  const existingRecord = activityData.find(record => record.date === today);

  if (existingRecord) {
    existingRecord.tasksCompleted += tasksCompleted;
    existingRecord.goalsCompleted += goalsCompleted;
  } else {
    activityData.push({
      date: today,
      tasksCompleted,
      goalsCompleted,
    });
  }

  saveActivityData(userId, activityData);
};

export const calculateStreak = (goal: Goal): number => {
  if (!goal.lastActivityDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = new Date(goal.lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastActivity.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    return 0;
  }

  return goal.currentStreak;
};

export const updateGoalStreak = (goal: Goal): Goal => {
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = goal.lastActivityDate?.split('T')[0];

  if (lastActivity === today) {
    return goal;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActivity === yesterdayStr) {
    goal.currentStreak += 1;
  } else if (lastActivity !== today) {
    goal.currentStreak = 1;
  }

  goal.lastActivityDate = new Date().toISOString();

  return goal;
};

export const getDaysLeft = (endDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const getProgressPercentage = (goal: Goal): number => {
  if (goal.tasks.length === 0) return 0;
  const completedTasks = goal.tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / goal.tasks.length) * 100);
};
