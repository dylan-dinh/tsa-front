import React, { useState } from 'react';
import { IconButton, Snackbar, Alert } from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Explore as ExploreIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import UserProfile from './UserProfile';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-[#9147ff] text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

interface PostProps {
  username: string;
  userImage: string;
  content: string;
  caption: string;
  likes: number;
  comments: number;
}

const Post: React.FC<PostProps> = ({ username, userImage, content, caption, likes, comments }) => (
  <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
    {/* Post Header */}
    <div className="flex items-center p-4">
      <img
        src={userImage}
        alt={username}
        className="w-10 h-10 rounded-full object-cover"
      />
      <span className="ml-3 font-semibold">{username}</span>
    </div>

    {/* Post Content */}
    <div className="aspect-square bg-gray-100 relative">
      <img
        src={content}
        alt="Post content"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Post Actions */}
    <div className="p-4">
      <div className="flex items-center space-x-4 mb-2">
        <button className="text-gray-600 hover:text-[#9147ff] transition-colors">
          <MessageIcon className="text-2xl" />
        </button>
        <button className="text-gray-600 hover:text-[#9147ff] transition-colors">
          <NotificationsIcon className="text-2xl" />
        </button>
        <button className="text-gray-600 hover:text-[#9147ff] transition-colors">
          <ExploreIcon className="text-2xl" />
        </button>
      </div>

      {/* Likes */}
      <div className="font-semibold mb-1">{likes} likes</div>

      {/* Caption */}
      <div className="text-sm">
        <span className="font-semibold mr-2">{username}</span>
        {caption}
      </div>

      {/* Comments */}
      <div className="text-sm text-gray-500 mt-1">
        View all {comments} comments
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [activeTab, setActiveTab] = useState<'people' | 'hub'>('people');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const renderContent = () => {
    switch (activeNavItem) {
      case 'profile':
        return <UserProfile />;
      default:
        return (
          <div className="max-w-xl mx-auto">
            {/* Tabs */}
            <div className="flex justify-center space-x-8 py-4 border-b">
              <button
                onClick={() => setActiveTab('people')}
                className={`font-semibold ${
                  activeTab === 'people'
                    ? 'text-[#9147ff]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                People
              </button>
              <button
                onClick={() => setActiveTab('hub')}
                className={`font-semibold ${
                  activeTab === 'hub'
                    ? 'text-[#9147ff]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Hub
              </button>
            </div>

            {/* Followed Users Carousel */}
            <div className="py-4">
              <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((user) => (
                  <div
                    key={user}
                    className="flex flex-col items-center space-y-2 flex-shrink-0"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-[#9147ff] p-0.5">
                      <img
                        src={`https://i.pravatar.cc/150?img=${user}`}
                        alt={`User ${user}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium">user_{user}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feed Posts */}
            <div className="space-y-6">
              <Post
                username="johndoe"
                userImage="https://i.pravatar.cc/150?img=1"
                content="https://picsum.photos/800/800"
                caption="Just finished streaming some amazing gameplay! 🎮 #gaming #twitch"
                likes={1234}
                comments={89}
              />
              <Post
                username="janedoe"
                userImage="https://i.pravatar.cc/150?img=2"
                content="https://picsum.photos/800/801"
                caption="New setup is finally complete! What do you think? 💻 #setup #gaming"
                likes={856}
                comments={42}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-200 p-4 flex flex-col h-screen bg-white fixed">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#9147ff] to-[#7c3bdb] bg-clip-text text-transparent">
            ClipIt
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-2">
          <NavItem
            icon={<HomeIcon />}
            label="Home"
            isActive={activeNavItem === 'home'}
            onClick={() => setActiveNavItem('home')}
          />
          <NavItem
            icon={<SearchIcon />}
            label="Search"
            isActive={activeNavItem === 'search'}
            onClick={() => setActiveNavItem('search')}
          />
          <NavItem
            icon={<ExploreIcon />}
            label="Explore"
            isActive={activeNavItem === 'explore'}
            onClick={() => setActiveNavItem('explore')}
          />
          <NavItem
            icon={<MessageIcon />}
            label="Messages"
            isActive={activeNavItem === 'messages'}
            onClick={() => setActiveNavItem('messages')}
          />
          <NavItem
            icon={<NotificationsIcon />}
            label="Notifications"
            isActive={activeNavItem === 'notifications'}
            onClick={() => setActiveNavItem('notifications')}
          />
          <NavItem
            icon={<PersonIcon />}
            label="Profile"
            isActive={activeNavItem === 'profile'}
            onClick={() => setActiveNavItem('profile')}
          />
        </div>

        {/* Settings */}
        <div className="mt-auto">
          <NavItem
            icon={<SettingsIcon />}
            label="Settings"
            isActive={activeNavItem === 'settings'}
            onClick={() => setActiveNavItem('settings')}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {renderContent()}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;