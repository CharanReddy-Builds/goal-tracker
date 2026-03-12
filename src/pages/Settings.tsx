import { useState, useEffect } from 'react';
import { User, Mail, Trash2, Download, Upload } from 'lucide-react';
import { getCurrentUser, getGoals, getActivityData } from '../utils/storage';

export default function Settings() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleExportData = () => {
    if (!user) return;

    const goals = getGoals(user.id);
    const activity = getActivityData(user.id);

    const exportData = {
      user,
      goals,
      activity,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `goaltrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (data.user && data.goals && data.activity) {
          localStorage.setItem(`goals_${data.user.id}`, JSON.stringify(data.goals));
          localStorage.setItem(`activity_${data.user.id}`, JSON.stringify(data.activity));
          alert('Data imported successfully! Refresh the page to see your data.');
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAllData = () => {
    if (!user) return;

    localStorage.removeItem(`goals_${user.id}`);
    localStorage.removeItem(`activity_${user.id}`);

    setShowDeleteConfirm(false);
    alert('All data has been deleted.');
    window.location.reload();
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and data</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <User className="text-gray-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium text-gray-800">{user?.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-gray-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Data Management</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Export Your Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download all your goals and activity data as a JSON file for backup.
              </p>
              <button
                onClick={handleExportData}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center space-x-2"
              >
                <Download size={20} />
                <span>Export Data</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Import Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Restore your data from a previously exported backup file.
              </p>
              <label className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all flex items-center space-x-2 cursor-pointer inline-flex">
                <Upload size={20} />
                <span>Import Data</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Delete All Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Permanently delete all your goals and activity data. This action cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all flex items-center space-x-2"
            >
              <Trash2 size={20} />
              <span>Delete All Data</span>
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete all your data? This action cannot be undone and all your goals and activity history will be permanently lost.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteAllData}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">About GoalTrack</h2>
          <p className="text-gray-700 mb-2">
            Version 1.0.0
          </p>
          <p className="text-gray-600 text-sm">
            A modern goal tracking application built to help you achieve your dreams. All your data is stored locally on your device for complete privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
