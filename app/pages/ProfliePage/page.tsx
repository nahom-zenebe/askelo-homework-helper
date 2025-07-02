"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/lib/auth-client';
import { FiUser, FiMail, FiLock, FiCalendar, FiGlobe, FiEdit, FiSave, FiX, FiLogOut, FiTrash2, FiShield, FiActivity, FiSmartphone, FiMoon, FiSun } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios'
type UserProfile = {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  lastLogin: string;
  timezone?: string;
  isTwoFactorEnabled: boolean;
  preferredTheme: 'light' | 'dark' | 'system';
};

type ConnectedDevice = {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  location: string;
  ipAddress: string;
  isCurrent: boolean;
};

type SecurityEvent = {
  id: string;
  type: 'login' | 'password_change' | '2fa_enabled' | 'device_added';
  timestamp: string;
  device?: string;
  location?: string;
  ipAddress?: string;
};

type UsageStat = {
  label: string;
  value: string;
  change?: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading, error: sessionError, refetch: refetchSession } = authClient.useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferredTheme: 'system' as 'light' | 'dark' | 'system'
  });
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStat[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'devices' | 'analytics'>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);


  // Initialize profile data
  useEffect(() => {
    if (!sessionLoading && session) {
      fetchProfileData();
      checkDarkModePreference();
    } else if (sessionError) {
      router.push('/login');
    }
  }, [session, sessionLoading, sessionError]);

  const checkDarkModePreference = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  };

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, these would be separate API calls
      const mockProfile: UserProfile = {
        id: session?.user.id || '',
        name: session?.user.name || 'Unknown User',
        email: session?.user.email || '',
        image: session?.user.image,
        createdAt: '2023-01-15T10:30:00Z',
        lastLogin: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isTwoFactorEnabled: true,
        preferredTheme: 'system'
      };

      const mockDevices: ConnectedDevice[] = [
        {
          id: '1',
          name: 'MacBook Pro',
          type: 'Laptop',
          lastUsed: new Date().toISOString(),
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.100',
          isCurrent: true
        },
        {
          id: '2',
          name: 'iPhone 13',
          type: 'Mobile',
          lastUsed: new Date(Date.now() - 86400000).toISOString(),
          location: 'New York, NY',
          ipAddress: '172.56.23.45',
          isCurrent: false
        }
      ];

      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'login',
          timestamp: new Date().toISOString(),
          device: 'MacBook Pro',
          location: 'San Francisco, CA',
          ipAddress: '192.168.1.100'
        },
        {
          id: '2',
          type: 'password_change',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          type: '2fa_enabled',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        }
      ];

      const mockStats: UsageStat[] = [
        { label: 'Active Sessions', value: '2', change: 0 },
        { label: 'Storage Used', value: '4.7 GB / 15 GB', change: 12 },
        { label: 'API Requests', value: '1,243', change: 24 },
        { label: 'Tasks Completed', value: '87', change: -5 }
      ];

      setProfile(mockProfile);
      setEditForm({
        name: mockProfile.name,
        email: mockProfile.email,
        timezone: mockProfile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        preferredTheme: mockProfile.preferredTheme
      });
      setConnectedDevices(mockDevices);
      setSecurityEvents(mockEvents);
      setUsageStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };



  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        name: profile.name,
        email: profile.email,
        timezone: profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        preferredTheme: profile.preferredTheme
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedProfile = {
        ...profile,
        name: editForm.name,
        email: editForm.email,
        timezone: editForm.timezone,
        preferredTheme: editForm.preferredTheme
      } as UserProfile;

      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
      
      // Refresh session if email changed
      if (editForm.email !== profile?.email) {
        await refetchSession();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Logged out from all other devices');
      setConnectedDevices(prev => prev.filter(d => d.isCurrent));
    } catch (error) {
      console.error('Failed to logout all devices:', error);
      toast.error('Failed to logout all devices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await axios.delete(`/api/user/deleteAccount/${session?.user.id}`);


      toast.success('Account deleted successfully');
      router.push('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTwoFactorAuth = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => prev ? {
        ...prev,
        isTwoFactorEnabled: !prev.isTwoFactorEnabled
      } : null);

      toast.success(
        profile?.isTwoFactorEnabled 
          ? 'Two-factor authentication disabled' 
          : 'Two-factor authentication enabled'
      );
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
      toast.error('Failed to update two-factor authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    
    // In a real app, save preference to server
    setEditForm(prev => ({
      ...prev,
      preferredTheme: newMode ? 'dark' : 'light'
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (sessionLoading || isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-4">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-white"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-indigo-400 border-2 border-white flex items-center justify-center">
                    <FiUser size={24} />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-indigo-100">{profile.email}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-indigo-700 hover:bg-indigo-800 transition-colors"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
                <button
                  onClick={() => authClient.signOut()}
                  className="flex items-center space-x-1 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiLogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('devices')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'devices' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                Devices
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'analytics' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                Analytics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FiX size={16} className="inline mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        <FiSave size={16} className="inline mr-1" />
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEditProfile}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      <FiEdit size={16} className="inline mr-1" />
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
                      />
                    ) : (
                      <div className="px-3 py-2 border border-transparent rounded-lg">{profile.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
                      />
                    ) : (
                      <div className="px-3 py-2 border border-transparent rounded-lg">{profile.email}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                    {isEditing ? (
                      <select
                        value={editForm.timezone}
                        onChange={(e) => setEditForm({...editForm, timezone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 border border-transparent rounded-lg">{profile.timezone}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme Preference</label>
                    {isEditing ? (
                      <select
                        value={editForm.preferredTheme}
                        onChange={(e) => setEditForm({...editForm, preferredTheme: e.target.value as 'light' | 'dark' | 'system'})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
                      >
                        <option value="system">System Default</option>
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 border border-transparent rounded-lg capitalize">{profile.preferredTheme}</div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium">Account Information</h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <FiCalendar className="text-gray-500 dark:text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="font-medium">{formatDate(profile.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <FiGlobe className="text-gray-500 dark:text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                        <p className="font-medium">{formatDate(profile.lastLogin)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <FiLock className="text-indigo-500" size={20} />
                        <div>
                          <h3 className="font-medium">Password</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 2 weeks ago</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <FiShield className={profile.isTwoFactorEnabled ? "text-green-500" : "text-yellow-500"} size={20} />
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {profile.isTwoFactorEnabled ? 'Enabled' : 'Disabled'} - {profile.isTwoFactorEnabled ? 'Extra security for your account' : 'Add an extra layer of security'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleTwoFactorAuth}
                        className={`px-3 py-1 text-sm font-medium rounded-lg ${profile.isTwoFactorEnabled ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'} transition-colors`}
                      >
                        {profile.isTwoFactorEnabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-3">Recent Security Events</h3>
                    <div className="space-y-3">
                      {securityEvents.map((event) => (
                        <div key={event.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                          <div className={`mt-1 flex-shrink-0 h-3 w-3 rounded-full ${
                            event.type === 'login' ? 'bg-green-500' : 
                            event.type === 'password_change' ? 'bg-blue-500' : 
                            'bg-purple-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {event.type === 'login' ? 'Login' : 
                               event.type === 'password_change' ? 'Password Changed' : 
                               'Two-Factor Enabled'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(event.timestamp)}
                              {event.device && ` • ${event.device}`}
                              {event.location && ` • ${event.location}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Danger Zone</h3>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-sm text-red-700 dark:text-red-300">Delete your account permanently</p>
                        <p className="text-xs text-red-600 dark:text-red-400">This action cannot be undone. All your data will be erased.</p>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap"
                      >
                        <FiTrash2 size={16} className="inline mr-1" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Devices Tab */}
            {activeTab === 'devices' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Connected Devices</h2>
                  <button
                    onClick={handleLogoutAllDevices}
                    className="px-3 py-1 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Logout All Other Devices
                  </button>
                </div>

                <div className="space-y-4">
                  {connectedDevices.map((device) => (
                    <div key={device.id} className={`p-4 border rounded-lg ${device.isCurrent ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FiSmartphone className={device.isCurrent ? "text-indigo-500" : "text-gray-500 dark:text-gray-400"} size={20} />
                          <div>
                            <h3 className="font-medium">{device.name} {device.isCurrent && <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded">Current Device</span>}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{device.type} • {device.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatDate(device.lastUsed)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{device.ipAddress}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Usage Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {usageStats.map((stat, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                          <p className="text-xl font-semibold">{stat.value}</p>
                        </div>
                        {stat.change !== undefined && (
                          <div className={`flex items-center ${stat.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            <span className="text-sm font-medium">
                              {stat.change >= 0 ? '+' : ''}{stat.change}%
                            </span>
                            <FiActivity className="ml-1" size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium mb-4">Activity Overview</h3>
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Activity chart would be displayed here</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-4">Feature Usage</h3>
                    <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">Feature usage chart would be displayed here</p>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-medium mb-4">Storage Breakdown</h3>
                    <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">Storage breakdown chart would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}