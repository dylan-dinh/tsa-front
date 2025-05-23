import React, { useState } from 'react';
import { IconButton, Snackbar, Alert, Modal, Box } from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Explore as ExploreIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as ChatBubbleIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ArrowUpward as UpvoteIcon,
  AccessTime as TimeIcon,
  SportsEsports as GameIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ArrowDownIcon
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
  timestamp: string;
  game: string;
  onNextPost?: () => void;
  onPrevPost?: () => void;
}

const Post: React.FC<PostProps> = ({ 
  username, 
  userImage, 
  content, 
  caption, 
  likes, 
  comments, 
  timestamp, 
  game,
  onNextPost,
  onPrevPost 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUpvote, setShowUpvote] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastWheelTime, setLastWheelTime] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
    setIsScrolling(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchEnd = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    const diffX = touchEnd.x - touchStart.x;
    const diffY = touchEnd.y - touchStart.y;

    if (Math.abs(diffY) > Math.abs(diffX)) {
      setIsScrolling(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isScrolling) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    const diffX = touchEnd.x - touchStart.x;
    const diffY = touchEnd.y - touchStart.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 100) { // Swipe right
        setShowUpvote(true);
        setTimeout(() => setShowUpvote(false), 1000);
      } else if (diffX < -100 && onNextPost) { // Swipe left
        onNextPost();
      }
    } else if (diffY > 100 && onNextPost) { // Swipe down
      onNextPost();
    } else if (diffY < -100 && onPrevPost) { // Swipe up
      onPrevPost();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    // Prevent rapid scrolling
    if (now - lastWheelTime < 500) return;
    
    if (e.deltaY > 0 && onNextPost) { // Scroll down
      setLastWheelTime(now);
      onNextPost();
    } else if (e.deltaY < 0 && onPrevPost) { // Scroll up
      setLastWheelTime(now);
      onPrevPost();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
        <div 
          className="aspect-square bg-gray-100 relative cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={content}
            alt="Post content"
            className="w-full h-full object-cover"
          />
          {showUpvote && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <UpvoteIcon className="text-white text-6xl animate-bounce" />
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <button 
                className="text-gray-600 hover:text-[#9147ff] transition-colors"
                onClick={() => setIsLiked(!isLiked)}
              >
                {isLiked ? (
                  <FavoriteIcon className="text-2xl text-[#9147ff]" />
                ) : (
                  <FavoriteBorderIcon className="text-2xl" />
                )}
              </button>
              <button className="text-gray-600 hover:text-[#9147ff] transition-colors">
                <ChatBubbleIcon className="text-2xl" />
              </button>
              <button className="text-gray-600 hover:text-[#9147ff] transition-colors">
                <ShareIcon className="text-2xl" />
              </button>
            </div>
            <button 
              className="text-gray-600 hover:text-[#9147ff] transition-colors"
              onClick={() => setIsSaved(!isSaved)}
            >
              {isSaved ? (
                <BookmarkIcon className="text-2xl text-[#9147ff]" />
              ) : (
                <BookmarkBorderIcon className="text-2xl" />
              )}
            </button>
          </div>

          {/* Likes */}
          <div className="font-semibold mb-1">{likes + (isLiked ? 1 : 0)} likes</div>

          {/* Caption */}
          <div className="text-sm">
            <span className="font-semibold mr-2">{username}</span>
            {caption}
          </div>

          {/* Game and Time */}
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <GameIcon className="text-lg mr-1" />
              <span>{game}</span>
            </div>
            <div className="flex items-center">
              <TimeIcon className="text-lg mr-1" />
              <span>{timestamp}</span>
            </div>
          </div>

          {/* Comments */}
          <div className="text-sm text-gray-500 mt-1">
            View all {comments} comments
          </div>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        className="flex items-center justify-center"
      >
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div 
            className="h-full w-full flex flex-col"
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            {/* Close Buttons */}
            <button 
              className="absolute top-4 right-4 z-50 text-white hover:text-gray-300"
              onClick={handleModalClose}
            >
              <CloseIcon className="text-3xl" />
            </button>
            <button 
              className="absolute top-4 left-4 z-50 text-white hover:text-gray-300"
              onClick={handleModalClose}
            >
              <CloseIcon className="text-3xl" />
            </button>

            {/* Navigation Arrow */}
            {onNextPost && (
              <button 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 text-white animate-bounce"
                onClick={onNextPost}
              >
                <ArrowDownIcon className="text-4xl" />
              </button>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row h-full">
              {/* Image Section */}
              <div className="flex-1 relative">
                <img
                  src={content}
                  alt="Post content"
                  className="w-full h-full object-contain"
                />
                {showUpvote && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <UpvoteIcon className="text-white text-8xl animate-bounce" />
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="w-full md:w-96 bg-white overflow-y-auto">
                {/* User Info */}
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <img
                      src={userImage}
                      alt={username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <div className="font-semibold">{username}</div>
                      <div className="text-sm text-gray-500">{timestamp}</div>
                    </div>
                  </div>
                </div>

                {/* Game Info */}
                <div className="p-4 border-b">
                  <div className="flex items-center text-gray-600">
                    <GameIcon className="mr-2" />
                    <span>{game}</span>
                  </div>
                </div>

                {/* Caption */}
                <div className="p-4 border-b">
                  <span className="font-semibold mr-2">{username}</span>
                  {caption}
                </div>

                {/* Actions */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <button 
                      className="text-gray-600 hover:text-[#9147ff] transition-colors"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      {isLiked ? (
                        <FavoriteIcon className="text-2xl text-[#9147ff]" />
                      ) : (
                        <FavoriteBorderIcon className="text-2xl" />
                      )}
                    </button>
                    <button className="text-gray-600 hover:text-[#9147ff] transition-colors">
                      <ChatBubbleIcon className="text-2xl" />
                    </button>
                    <button className="text-gray-600 hover:text-[#9147ff] transition-colors">
                      <ShareIcon className="text-2xl" />
                    </button>
                    <button 
                      className="text-gray-600 hover:text-[#9147ff] transition-colors ml-auto"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      {isSaved ? (
                        <BookmarkIcon className="text-2xl text-[#9147ff]" />
                      ) : (
                        <BookmarkBorderIcon className="text-2xl" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-4">
                    {comments} comments
                  </div>
                  {/* Example Comments */}
                  {[1, 2, 3].map((comment) => (
                    <div key={comment} className="mb-4">
                      <div className="flex items-start">
                        <img
                          src={`https://i.pravatar.cc/150?img=${comment + 10}`}
                          alt={`Commenter ${comment}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <div className="font-semibold text-sm">user_{comment}</div>
                          <p className="text-sm text-gray-600">
                            This is a sample comment #{comment}. Click to expand and see more details.
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <button className="text-xs text-gray-500 hover:text-[#9147ff]">
                              Like
                            </button>
                            <button className="text-xs text-gray-500 hover:text-[#9147ff]">
                              Reply
                            </button>
                            <span className="text-xs text-gray-500">2h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

interface Post {
  id: number;
  username: string;
  userImage: string;
  content: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  game: string;
}

const Dashboard: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [activeTab, setActiveTab] = useState<'people' | 'hub'>('people');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  // Mock posts data
  const posts: Post[] = [
    {
      id: 1,
      username: "johndoe",
      userImage: "https://i.pravatar.cc/150?img=1",
      content: "https://picsum.photos/800/800",
      caption: "Just finished streaming some amazing gameplay! 🎮 #gaming #twitch",
      likes: 1234,
      comments: 89,
      timestamp: "2 hours ago",
      game: "Valorant"
    },
    {
      id: 2,
      username: "janedoe",
      userImage: "https://i.pravatar.cc/150?img=2",
      content: "https://picsum.photos/800/801",
      caption: "New setup is finally complete! What do you think? 💻 #setup #gaming",
      likes: 856,
      comments: 42,
      timestamp: "4 hours ago",
      game: "League of Legends"
    },
    {
      id: 3,
      username: "gamingpro",
      userImage: "https://i.pravatar.cc/150?img=3",
      content: "https://picsum.photos/800/802",
      caption: "Epic 1v5 clutch in ranked! 🎯 #valorant #clutch",
      likes: 2345,
      comments: 156,
      timestamp: "1 hour ago",
      game: "Valorant"
    },
    {
      id: 4,
      username: "streamerlife",
      userImage: "https://i.pravatar.cc/150?img=4",
      content: "https://picsum.photos/800/803",
      caption: "Just hit Diamond! The grind was worth it 💎 #leagueoflegends",
      likes: 1890,
      comments: 98,
      timestamp: "3 hours ago",
      game: "League of Legends"
    }
  ];

  const handleNextPost = () => {
    setCurrentPostIndex((prevIndex) => 
      prevIndex < posts.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevPost = () => {
    setCurrentPostIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

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
              {posts.map((post, index) => (
                <Post
                  key={post.id}
                  username={post.username}
                  userImage={post.userImage}
                  content={post.content}
                  caption={post.caption}
                  likes={post.likes}
                  comments={post.comments}
                  timestamp={post.timestamp}
                  game={post.game}
                  onNextPost={index < posts.length - 1 ? handleNextPost : undefined}
                  onPrevPost={index > 0 ? handlePrevPost : undefined}
                />
              ))}
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