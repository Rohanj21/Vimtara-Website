import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  StyleSheet, SafeAreaView, ScrollView 
} from 'react-native';
import AIMessageBubble from '../components/AIMessageBubble';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function UserDashboard() {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('ai_chat'); // 'ai_chat' | 'filings'
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: "### Welcome to Vimtara Statutory AI 👋\nAsk me anything about Indian statutory compliance, cap tables, or ESOP management."
    }
  ]);

  const handleSendQuery = async () => {
    if (!inputPrompt.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: inputPrompt };
    setMessages(prev => [...prev, userMsg]);
    const currentQuery = inputPrompt;
    setInputPrompt('');

    try {
      // Connect to Python RAG service endpoint
      const res = await axios.post(`${API_URL}/ai/query`, { prompt: currentQuery });
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: res.data.response || "No response received." 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), sender: 'ai', text: "⚠️ Network connection error. Please verify API host." }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>User Portal</Text>
          <Text style={styles.headerSubtitle}>Statutory Compliance Desk</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ai_chat' && styles.activeTab]} 
          onPress={() => setActiveTab('ai_chat')}
        >
          <Text style={[styles.tabText, activeTab === 'ai_chat' && styles.activeTabText]}>AI Copilot</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'filings' && styles.activeTab]} 
          onPress={() => setActiveTab('filings')}
        >
          <Text style={[styles.tabText, activeTab === 'filings' && styles.activeTabText]}>Active Filings</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'ai_chat' ? (
        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={item.sender === 'user' ? styles.userBubble : styles.aiWrapper}>
                {item.sender === 'user' ? (
                  <Text style={styles.userText}>{item.text}</Text>
                ) : (
                  <AIMessageBubble content={item.text} />
                )}
              </View>
            )}
            contentContainerStyle={{ paddingVertical: 12 }}
          />

          {/* Input Box */}
          <View style={styles.inputBar}>
            <TextInput 
              style={styles.chatInput} 
              placeholder="Ask compliance query..."
              placeholderTextColor="#8d6e63"
              value={inputPrompt}
              onChangeText={setInputPrompt}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendQuery}>
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.filingContainer}>
          <Text style={styles.sectionHeader}>Upcoming Statutory Deadlines</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>GSTR-3B Monthly Return</Text>
            <Text style={styles.cardSub}>Due Date: 20th of this month</Text>
            <View style={[styles.badge, { backgroundColor: '#fff3cd' }]}>
              <Text style={{ color: '#856404', fontWeight: 'bold' }}>IN PROGRESS</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>PF & ESIC Settlement</Text>
            <Text style={styles.cardSub}>Due Date: 15th of this month</Text>
            <View style={[styles.badge, { backgroundColor: '#d4edda' }]}>
              <Text style={{ color: '#155724', fontWeight: 'bold' }}>COMPLETED</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#3E2723' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#D7CCC8', fontSize: 12 },
  logoutBtn: { backgroundColor: '#5D4037', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  tabBar: { flexDirection: 'row', backgroundColor: '#EFEBE9', padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#FFFFFF' },
  tabText: { color: '#5D4037', fontWeight: '600' },
  activeTabText: { color: '#3E2723', fontWeight: 'bold' },
  chatContainer: { flex: 1, paddingHorizontal: 16 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#3E2723', padding: 12, borderRadius: 12, marginVertical: 4, maxWidth: '80%' },
  userText: { color: '#fff', fontSize: 14 },
  aiWrapper: { alignSelf: 'flex-start', marginVertical: 4, width: '100%' },
  inputBar: { flexDirection: 'row', paddingVertical: 12, borderTopWidth: 1, borderColor: '#e2e8f0' },
  chatInput: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fff', color: '#000' },
  sendBtn: { backgroundColor: '#3E2723', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8, marginLeft: 8 },
  sendBtnText: { color: '#fff', fontWeight: 'bold' },
  filingContainer: { padding: 16 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#3E2723', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  cardSub: { color: '#64748b', marginVertical: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 8 }
});