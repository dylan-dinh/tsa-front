import React, { useState } from 'react';
import { IconButton, Snackbar, Alert } from '@mui/material';
import {
  Edit as EditIcon,
  Share as ShareIcon,
  VideoLibrary as VideoIcon,
  EmojiEvents as AwardIcon,
  LocalOffer as TagIcon,
  LiveTv as TwitchIcon,
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
  Add as AddIcon,
  Message as MessageIcon
} from '@mui/icons-material';

interface SocialLinkProps {
  icon: React.ReactNode;
  url: string;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, url, label }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-[#9147ff] transition-colors"
    title={label}
  >
    <span className="text-2xl">{icon}</span>
  </a>
);

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'hall' | 'tagged'>('content');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Mock user data
  const userData = {
    username: 'johndoe',
    fullName: 'John Doe',
    bio: 'Gaming enthusiast | Twitch streamer | Content creator 🎮',
    profileImage: 'https://i.pravatar.cc/150?img=1',
    stats: {
      posts: 42,
      followers: 1234,
      following: 567
    },
    socialLinks: {
      twitch: 'https://twitch.tv/johndoe',
      youtube: 'https://youtube.com/johndoe',
      tiktok: 'https://tiktok.com/@johndoe',
      instagram: 'https://instagram.com/johndoe'
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically handle the image upload
      console.log('Image selected:', file);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {userData.username}
        </h1>
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Image */}
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <img
              src={userData.profileImage}
              alt={userData.username}
              className="w-full h-full rounded-full object-cover border-4 border-[#9147ff]"
            />
            <label
              htmlFor="profile-image-upload"
              className="absolute bottom-0 right-0 bg-[#9147ff] text-white rounded-full p-2 cursor-pointer hover:bg-[#7c3bdb] transition-colors"
            >
              <AddIcon />
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            {/* Bio */}
            <p className="text-gray-600 text-sm md:text-base">
              {userData.bio}
            </p>

            {/* Stats */}
            <div className="flex space-x-8">
              <div className="text-center">
                <span className="block font-bold text-gray-900">{userData.stats.posts}</span>
                <span className="text-sm text-gray-600">Posts</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-gray-900">{userData.stats.followers}</span>
                <span className="text-sm text-gray-600">Followers</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-gray-900">{userData.stats.following}</span>
                <span className="text-sm text-gray-600">Following</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <SocialLink
                icon={<TwitchIcon />}
                url={userData.socialLinks.twitch}
                label="Twitch"
              />
              <SocialLink
                icon={<YouTubeIcon />}
                url={userData.socialLinks.youtube}
                label="YouTube"
              />
              <SocialLink
                icon={<InstagramIcon />}
                url={userData.socialLinks.instagram}
                label="Instagram"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                className="px-6 py-2 rounded-full shadow-lg bg-[#9147ff] hover:bg-[#7c3bdb] transition font-semibold text-white text-base focus:outline-none"
                style={{ fontFamily: 'inherit', minHeight: 48 }}
              >
                <EditIcon className="inline-block mr-2" />
                Edit Profile
              </button>
              <button
                className="px-6 py-2 rounded-full shadow-lg bg-white border border-gray-200 hover:bg-gray-100 transition font-semibold text-[#9147ff] text-base focus:outline-none"
                style={{ fontFamily: 'inherit', minHeight: 48 }}
              >
                <ShareIcon className="inline-block mr-2" />
                Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-12">
          <div className="flex justify-center space-x-32 py-4">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center space-x-2 ${
                activeTab === 'content'
                  ? 'text-[#9147ff]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <VideoIcon className="text-4xl" />
            </button>
            <button
              onClick={() => setActiveTab('hall')}
              className={`flex items-center space-x-2 ${
                activeTab === 'hall'
                  ? 'text-[#9147ff]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <AwardIcon className="text-4xl" />
            </button>
            <button
              onClick={() => setActiveTab('tagged')}
              className={`flex items-center space-x-2 ${
                activeTab === 'tagged'
                  ? 'text-[#9147ff]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TagIcon className="text-4xl" />
            </button>
          </div>

          {/* Tab Indicator Bar */}
          <div className="relative h-1 bg-gray-200">
            <div
              className={`absolute top-0 h-full bg-[#9147ff] transition-all duration-300 ${
                activeTab === 'content'
                  ? 'left-[15%] w-[8%]'
                  : activeTab === 'hall'
                  ? 'left-[46%] w-[8%]'
                  : 'left-[77%] w-[8%]'
              }`}
            />
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'content' && (
              <div className="grid grid-cols-3 gap-1 max-w-4xl mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                  <div key={item} className="aspect-square bg-gray-100 relative group cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 transition-opacity">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center">
                          <VideoIcon className="text-2xl mr-1" />
                          <span>1</span>
                        </div>
                        <div className="flex items-center">
                          <MessageIcon className="text-2xl mr-1" />
                          <span>2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'hall' && (
              <div className="grid grid-cols-3 gap-1 max-w-4xl mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                  <div key={item} className="aspect-square bg-gray-100 relative group cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 transition-opacity">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center">
                          <AwardIcon className="text-2xl mr-1" />
                          <span>1</span>
                        </div>
                        <div className="flex items-center">
                          <MessageIcon className="text-2xl mr-1" />
                          <span>2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'tagged' && (
              <div className="grid grid-cols-3 gap-1 max-w-4xl mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                  <div key={item} className="aspect-square bg-gray-100 relative group cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 transition-opacity">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center">
                          <TagIcon className="text-2xl mr-1" />
                          <span>1</span>
                        </div>
                        <div className="flex items-center">
                          <MessageIcon className="text-2xl mr-1" />
                          <span>2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

export default UserProfile;
