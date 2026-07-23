import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, checkStoredToken } = useContext(AuthContext);

  // --- DEV TOOLS: Inject Users for RBAC Testing ---
  // This bypasses the Node.js backend so you can test mobile UI roles instantly
  const injectMockUser = async (role) => {
    const mockToken = `mock_jwt_token_${role}`;
    await SecureStore.setItemAsync('userToken', mockToken);
    await SecureStore.setItemAsync('userRole', role);
    
    // Force the app to re-check the tokens and switch the navigation stack
    alert(`Injected ${role} environment. Reloading...`);
    // In a real app you'd call a dedicated context function, but for now we reload the app state
    // by forcing a re-render or navigating if we had access to the navigation prop.
    // If you exposed a 'setAuthState' in your context, you'd call it here.
    // Assuming your checkStoredToken is exposed in AuthContext:
    if (checkStoredToken) checkStoredToken();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        
        {/* Branding Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>V</Text>
          </View>
          <Text style={styles.title}>Vimtara Mobile</Text>
          <Text style={styles.subtitle}>Corporate Compliance Hub</Text>
        </View>

        {/* Input Form */}
        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Work Email" 
            placeholderTextColor="#8d6e63" // Visible placeholder text
            onChangeText={setEmail} 
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor="#8d6e63" // Visible placeholder text
            secureTextEntry 
            onChangeText={setPassword} 
            value={password}
          />
          
          <TouchableOpacity style={styles.loginButton} onPress={() => login(email, password)}>
            <Text style={styles.loginButtonText}>Access Secure Portal</Text>
          </TouchableOpacity>
        </View>

        {/* Developer Sandbox Section for RBAC Testing */}
        <View style={styles.devSandbox}>
          <Text style={styles.devTitle}>🛠 Dev Environment: Inject User</Text>
          <View style={styles.devButtons}>
            <TouchableOpacity style={[styles.devBtn, styles.adminBtn]} onPress={() => injectMockUser('ADMIN')}>
              <Text style={styles.devBtnText}>Admin</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.devBtn, styles.assistantBtn]} onPress={() => injectMockUser('ASSISTANT')}>
              <Text style={styles.devBtnText}>Assistant</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.devBtn, styles.userBtn]} onPress={() => injectMockUser('USER')}>
              <Text style={styles.devBtnText}>User</Text>
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 24, 
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: '#3E2723', // Primary Corporate Dark Brown
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#3E2723', // Primary Corporate Dark Brown
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#5D4037', // Lighter Corporate Brown
    marginTop: 6,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#D7CCC8', // Very light brown border
    padding: 16, 
    marginBottom: 16, 
    borderRadius: 12, 
    backgroundColor: '#FAFAFA',
    color: '#212121', // explicitly sets typed text to dark grey/black
    fontSize: 16,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#3E2723', // Primary Corporate Dark Brown
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  devSandbox: {
    marginTop: 50,
    padding: 16,
    backgroundColor: '#EFEBE9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7CCC8',
    borderStyle: 'dashed',
  },
  devTitle: {
    textAlign: 'center',
    color: '#5D4037',
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 12,
  },
  devButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  devBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  adminBtn: { backgroundColor: '#c62828' },
  assistantBtn: { backgroundColor: '#1565c0' },
  userBtn: { backgroundColor: '#616161' },
  devBtnText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  }
});