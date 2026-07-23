import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

// Import Context
import { AuthProvider, AuthContext } from './src/context/AuthContext';

// Import Screens
import LoginScreen from './src/screens/LoginScreen';
import UserDashboard from './src/screens/UserDashboard';
import AssistantDashboard from './src/screens/AssistantDashboard';
import AdminDashboard from './src/screens/AdminDashboard';

const Stack = createStackNavigator();

// This component listens to the context and switches the navigation
const AppNavigation = () => {
  const { isLoading, userToken, userRole } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3E2723" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          // NO TOKEN: Show Login Screen
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : userRole === 'ADMIN' ? (
          // ADMIN ROLE STACK
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : userRole === 'ASSISTANT' ? (
          // ASSISTANT ROLE STACK
          <Stack.Screen name="AssistantDashboard" component={AssistantDashboard} />
        ) : (
          // DEFAULT USER STACK
          <Stack.Screen name="UserDashboard" component={UserDashboard} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Wrap the entire app in the AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}