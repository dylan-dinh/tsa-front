import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data pour les conversations
const mockConversations = [
  {
    id: '1',
    user: {
      username: 'john_doe',
      displayName: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isOnline: true
    },
    lastMessage: 'See you tonight!',
    lastMessageTime: '18:45',
    unread: 2,
    messages: [
      { id: 'm1', fromMe: false, text: 'Hey!', time: '18:40' },
      { id: 'm2', fromMe: true, text: 'Hi John!', time: '18:41' },
      { id: 'm3', fromMe: false, text: 'See you tonight!', time: '18:45' }
    ]
  },
  {
    id: '2',
    user: {
      username: 'jane_smith',
      displayName: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isOnline: false
    },
    lastMessage: 'Thanks for the help!',
    lastMessageTime: '17:20',
    unread: 0,
    messages: [
      { id: 'm1', fromMe: true, text: 'No problem!', time: '17:20' }
    ]
  },
  {
    id: '3',
    user: {
      username: 'gamer_pro',
      displayName: 'Gamer Pro',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isOnline: true
    },
    lastMessage: 'Let\'s play tomorrow?',
    lastMessageTime: '16:10',
    unread: 1,
    messages: [
      { id: 'm1', fromMe: false, text: 'Let\'s play tomorrow?', time: '16:10' }
    ]
  }
];

const Messages = () => {
  const [search, setSearch] = useState('');
  const [selectedConv, setSelectedConv] = useState<typeof mockConversations[0] | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Filtrer les conversations selon la recherche
  const filteredConvs = search.trim()
    ? mockConversations.filter(conv =>
        conv.user.displayName.toLowerCase().includes(search.toLowerCase()) ||
        conv.user.username.toLowerCase().includes(search.toLowerCase())
      )
    : mockConversations;

  const handleSend = () => {
    if (!messageInput.trim() || !selectedConv) return;
    // Ajout du message à la conversation (mock, pas de backend)
    selectedConv.messages.push({
      id: `m${selectedConv.messages.length + 1}`,
      fromMe: true,
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setMessageInput('');
  };

  // Vue d'une conversation
  const ChatView = ({ conv }: { conv: typeof mockConversations[0] }) => (
    <View style={styles.chatContainer}>
      {/* Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => setSelectedConv(null)}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#9147ff" />
        </TouchableOpacity>
        <Image source={{ uri: conv.user.avatar }} style={styles.chatAvatar} />
        <View style={styles.chatUserInfo}>
          <Text style={styles.chatDisplayName}>{conv.user.displayName}</Text>
          <Text style={styles.chatUsername}>@{conv.user.username}</Text>
        </View>
        {conv.user.isOnline && <View style={styles.onlineDot} />}
      </View>
      {/* Messages */}
      <ScrollView style={styles.messagesList} contentContainerStyle={{ padding: 16 }}>
        {conv.messages.map((msg: { id: string; fromMe: boolean; text: string; time: string }) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.fromMe ? styles.messageFromMe : styles.messageFromOther
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>
      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={messageInput}
            onChangeText={setMessageInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <MaterialCommunityIcons name="send" size={22} color="#9147ff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );

  // Vue liste des conversations
  const ConversationList = () => (
    <View style={styles.convListContainer}>
      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={22} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <MaterialCommunityIcons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
      {/* Liste des conversations */}
      <FlatList
        data={filteredConvs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.convItem} onPress={() => setSelectedConv(item)}>
            <Image source={{ uri: item.user.avatar }} style={styles.convAvatar} />
            <View style={styles.convInfo}>
              <Text style={styles.convDisplayName}>{item.user.displayName}</Text>
              <Text style={styles.convLastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <View style={styles.convMeta}>
              <Text style={styles.convTime}>{item.lastMessageTime}</Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.convList}
      />
    </View>
  );

  return selectedConv ? <ChatView conv={selectedConv} /> : <ConversationList />;
};

const styles = StyleSheet.create({
  convListContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  convList: {
    paddingHorizontal: 8,
  },
  convItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  convAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  convInfo: {
    flex: 1,
    marginLeft: 12,
  },
  convDisplayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  convLastMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  convMeta: {
    alignItems: 'flex-end',
    minWidth: 40,
  },
  convTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  unreadBadge: {
    backgroundColor: '#9147ff',
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    marginTop: 4,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
  },
  chatUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  chatDisplayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  chatUsername: {
    fontSize: 12,
    color: '#6b7280',
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    marginLeft: 8,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 10,
    borderRadius: 16,
  },
  messageFromMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#9147ff',
  },
  messageFromOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
  },
  messageText: {
    color: '#111827',
    fontSize: 15,
  },
  messageTime: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: '#111827',
  },
  sendButton: {
    padding: 8,
  },
});

export default Messages; 