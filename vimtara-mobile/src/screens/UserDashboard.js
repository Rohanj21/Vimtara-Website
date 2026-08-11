import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import AIMessageBubble from '../components/AIMessageBubble';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';

export default function UserDashboard({ navigation }) {
  const { userToken } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Chat History from PostgreSQL on load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/history`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  // 2. Send message to backend and AI
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), sender: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Hits your Node API, saves user msg to Postgres, queries Python RAG, saves AI msg to Postgres, and returns result
      const response = await axios.post(`${API_URL}/chat/send`, 
        { prompt: currentInput },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      
      const aiMessage = { id: (Date.now() + 1).toString(), sender: 'ai', content: response.data.ai_response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { id: 'error', sender: 'ai', content: "Network Error: Could not connect to database." }]);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Mobile App Bar */}
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Text style={styles.hamburger}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Your Action Desk</Text>
          <View style={{width: 30}} />
        </View>

        {/* Thread Selector (Mimics the left column of the web app) */}
        <View style={styles.threadSelector}>
          <TouchableOpacity style={styles.newRequestBtn}>
            <Text style={styles.newRequestText}>+ New Request</Text>
          </TouchableOpacity>
          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            data={['New GST Filings', 'GST', 'GST Filings']}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.threadPill}>
                <Text style={styles.threadPillText}>⚡ {item}</Text>
              </View>
            )}
          />
        </View>

        {/* Chat Interface */}
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatArea}
          renderItem={({ item }) => (
            <View style={item.sender === 'user' ? styles.userBubble : styles.aiBubble}>
              {item.sender === 'user' ? (
                <Text style={styles.userText}>{item.content}</Text>
              ) : (
                <AIMessageBubble content={item.content} />
              )}
            </View>
          )}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Ask the AI Engine..."
            placeholderTextColor="#8d6e63"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={isLoading}>
            <Text style={styles.sendText}>{isLoading ? '...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  hamburger: { fontSize: 24, color: '#3E2723' },
  appBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D1A15' },
  threadSelector: { padding: 12, borderBottomWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#fafafa' },
  newRequestBtn: { backgroundColor: '#3E2723', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  newRequestText: { color: 'white', fontWeight: 'bold' },
  threadPill: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  threadPillText: { color: '#3E2723', fontWeight: '600' },
  chatArea: { padding: 16, paddingBottom: 40 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#5D4037', padding: 12, borderRadius: 16, borderTopRightRadius: 4, maxWidth: '80%', marginVertical: 6 },
  userText: { color: 'white', fontSize: 15 },
  aiBubble: { alignSelf: 'flex-start', marginVertical: 6, width: '100%' },
  inputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#FFFFFF' },
  input: { flex: 1, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, marginRight: 12, color: '#000' },
  sendBtn: { backgroundColor: '#3E2723', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 24 },
  sendText: { color: 'white', fontWeight: 'bold' }
});