import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import UserDashboard from './src/screens/UserDashboard';
import AssistantDashboard from './src/screens/AssistantDashboard';
import AdminDashboard from './src/screens/AdminDashboard';
import CustomDrawer from './src/components/CustomDrawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Wrap the dashboards in the Drawer Navigator
function DrawerRoutes() {
  const { userRole } = useContext(AuthContext);
  
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {userRole === 'ADMIN' ? (
        <Drawer.Screen name="ActionDesk" component={AdminDashboard} />
      ) : userRole === 'ASSISTANT' ? (
        <Drawer.Screen name="ActionDesk" component={AssistantDashboard} />
      ) : (
        <Drawer.Screen name="ActionDesk" component={UserDashboard} />
      )}
    </Drawer.Navigator>
  );
}

const AppNavigation = () => {
  const { isLoading, userToken } = useContext(AuthContext);

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
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Dashboard" component={DrawerRoutes} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}