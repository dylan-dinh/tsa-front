export interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  author: string;
  timestamp: string;
  likes: number;
  views: number;
  category: string;
  duration?: string;
}

// Données de démonstration
const mockData: ContentItem[] = [
  {
    id: '1',
    title: 'Amazing Gaming Highlights - Best Plays of the Week',
    description: 'Check out these incredible gaming moments from top streamers around the world. From clutch plays to unbelievable shots, this compilation has it all!',
    imageUrl: 'https://picsum.photos/400/200?random=1',
    author: 'GamingCentral',
    timestamp: '2 hours ago',
    likes: 1247,
    views: 45678,
    category: 'Gaming',
    duration: '15:30'
  },
  {
    id: '2',
    title: 'How to Master React Native in 2024',
    description: 'Complete guide to building mobile apps with React Native. Learn the latest patterns, best practices, and advanced techniques.',
    imageUrl: 'https://picsum.photos/400/200?random=2',
    author: 'CodeMaster',
    timestamp: '5 hours ago',
    likes: 892,
    views: 23456,
    category: 'Programming',
    duration: '45:20'
  },
  {
    id: '3',
    title: 'Cooking with Chef Sarah - Italian Pasta Masterclass',
    description: 'Learn to make authentic Italian pasta from scratch. From dough preparation to perfect sauce pairing, this tutorial covers everything.',
    imageUrl: 'https://picsum.photos/400/200?random=3',
    author: 'ChefSarah',
    timestamp: '1 day ago',
    likes: 2156,
    views: 78901,
    category: 'Cooking',
    duration: '32:15'
  },
  {
    id: '4',
    title: 'Travel Vlog: Exploring Hidden Gems in Japan',
    description: 'Join us on an adventure through the lesser-known spots in Japan. From secret temples to local markets, discover the real Japan.',
    imageUrl: 'https://picsum.photos/400/200?random=4',
    author: 'TravelExplorer',
    timestamp: '2 days ago',
    likes: 3456,
    views: 123456,
    category: 'Travel',
    duration: '28:45'
  },
  {
    id: '5',
    title: 'Fitness Challenge: 30-Day Transformation',
    description: 'Transform your body and mind with this comprehensive 30-day fitness challenge. Includes workouts, nutrition tips, and motivation.',
    imageUrl: 'https://picsum.photos/400/200?random=5',
    author: 'FitLife',
    timestamp: '3 days ago',
    likes: 5678,
    views: 234567,
    category: 'Fitness',
    duration: '18:30'
  },
  {
    id: '6',
    title: 'Music Production: Creating Hit Songs at Home',
    description: 'Learn professional music production techniques using only your computer. From composition to mixing and mastering.',
    imageUrl: 'https://picsum.photos/400/200?random=6',
    author: 'MusicProducer',
    timestamp: '4 days ago',
    likes: 1234,
    views: 45678,
    category: 'Music',
    duration: '52:10'
  },
  {
    id: '7',
    title: 'Photography Tips: Capturing Perfect Moments',
    description: 'Master the art of photography with these essential tips and techniques. Learn composition, lighting, and post-processing.',
    imageUrl: 'https://picsum.photos/400/200?random=7',
    author: 'PhotoPro',
    timestamp: '5 days ago',
    likes: 2345,
    views: 67890,
    category: 'Photography',
    duration: '25:40'
  },
  {
    id: '8',
    title: 'DIY Home Projects: Weekend Renovations',
    description: 'Transform your home with these easy DIY projects. From furniture restoration to room makeovers, get inspired!',
    imageUrl: 'https://picsum.photos/400/200?random=8',
    author: 'DIYMaster',
    timestamp: '1 week ago',
    likes: 3456,
    views: 89012,
    category: 'DIY',
    duration: '38:20'
  },
  {
    id: '9',
    title: 'Science Explained: The Universe in 20 Minutes',
    description: 'Journey through space and time as we explore the mysteries of the universe. From black holes to dark matter, simplified!',
    imageUrl: 'https://picsum.photos/400/200?random=9',
    author: 'ScienceGuru',
    timestamp: '1 week ago',
    likes: 4567,
    views: 145678,
    category: 'Science',
    duration: '20:00'
  },
  {
    id: '10',
    title: 'Business Success: Building Your Empire',
    description: 'Learn from successful entrepreneurs about building and scaling your business. Real stories, practical advice, and actionable strategies.',
    imageUrl: 'https://picsum.photos/400/200?random=10',
    author: 'BusinessGuru',
    timestamp: '2 weeks ago',
    likes: 6789,
    views: 234567,
    category: 'Business',
    duration: '42:15'
  }
];

// Fonction pour simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour générer des données supplémentaires
const generateMoreData = (startIndex: number, count: number): ContentItem[] => {
  const newData: ContentItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const id = (startIndex + i + 1).toString();
    const randomIndex = Math.floor(Math.random() * mockData.length);
    const baseItem = mockData[randomIndex];
    
    newData.push({
      ...baseItem,
      id,
      title: `${baseItem.title} - Part ${Math.floor(Math.random() * 10) + 1}`,
      imageUrl: `https://picsum.photos/400/200?random=${parseInt(id) + 10}`,
      likes: Math.floor(Math.random() * 5000) + 100,
      views: Math.floor(Math.random() * 100000) + 1000,
      timestamp: `${Math.floor(Math.random() * 7) + 1} days ago`
    });
  }
  
  return newData;
};

export const fetchContent = async (page: number, pageSize: number = 5): Promise<ContentItem[]> => {
  // Simuler un délai réseau
  await delay(Math.random() * 1000 + 500);
  
  // Simuler une erreur occasionnelle (5% de chance)
  if (Math.random() < 0.05) {
    throw new Error('Network error occurred');
  }
  
  const startIndex = (page - 1) * pageSize;
  
  // Pour les premières pages, utiliser les données de base
  if (page <= 2) {
    return mockData.slice(startIndex, startIndex + pageSize);
  }
  
  // Pour les pages suivantes, générer des données supplémentaires
  return generateMoreData(startIndex, pageSize);
};

export const searchContent = async (query: string, page: number = 1, pageSize: number = 5): Promise<ContentItem[]> => {
  await delay(Math.random() * 800 + 300);
  
  const filteredData = mockData.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.author.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );
  
  const startIndex = (page - 1) * pageSize;
  return filteredData.slice(startIndex, startIndex + pageSize);
};

export const getContentByCategory = async (category: string, page: number = 1, pageSize: number = 5): Promise<ContentItem[]> => {
  await delay(Math.random() * 600 + 200);
  
  const filteredData = mockData.filter(item => 
    item.category.toLowerCase() === category.toLowerCase()
  );
  
  const startIndex = (page - 1) * pageSize;
  return filteredData.slice(startIndex, startIndex + pageSize);
}; 