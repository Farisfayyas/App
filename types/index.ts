export type SwipeAction = 'like' | 'dislike' | 'cart';
export type PriceRange = 'budget' | 'mid' | 'premium' | 'luxury';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type FriendStatus = 'pending' | 'accepted' | 'blocked';

export interface Item {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  category: string;
  subcategory?: string;
  colors: string[];
  sizes: string[];
  // KEY: these tags power the recommendation algorithm
  styleTags: string[];
  material?: string;
  description?: string;
  shopUrl?: string;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  item: Item;
  selectedSize: string;
  quantity: number;
  addedAt: number;
}

// Stored per swipe — denormalised so the recommendation algo can build
// preference profiles from this table alone, no joins needed.
export interface SwipeRecord {
  itemId: string;
  action: SwipeAction;
  timestamp: number;
  sessionId: string;
  itemBrand: string;
  itemCategory: string;
  itemPriceRange: PriceRange;
  itemStyleTags: string[];
  itemColors: string[];
}

// Computed from SwipeRecord history by getPreferenceProfile()
export interface PreferenceProfile {
  topBrands: string[];
  topCategories: string[];
  topStyleTags: string[];
  topColors: string[];
  dominantPriceRange: PriceRange;
  likeRate: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  preferredSizes: string[];
  favouriteColors: string[];
  preferredBrands: string[];
  location?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string;
  sharedItem?: Item;
  createdAt: number;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  createdAt: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  currency: string;
  createdAt: number;
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: FriendStatus;
  createdAt: number;
}
