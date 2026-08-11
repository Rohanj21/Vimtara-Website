import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { AuthContext } from '../context/AuthContext';

export default function CustomDrawer(props) {
  const { logout, userRole } = useContext(AuthContext);

  const menuItems = {
    USER: ['Account Overview', 'Filing Repository', 'Action Desk', 'Your Plan'],
    ASSISTANT: ['Dashboard', 'Client Queue', 'Document Review'],
    ADMIN: ['Command Center', 'User Management', 'System Health']
  };

  const activeMenu = menuItems[userRole] || menuItems['USER'];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <Text style={styles.logo}>VIMTARA</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>ROLE: {userRole}</Text>
          </View>
        </View>

        {/* Dynamic RBAC Menu Items */}
        <View style={styles.menuContainer}>
          {activeMenu.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.menuItem, item === 'Action Desk' && styles.activeMenuItem]}
              onPress={() => props.navigation.navigate(item.replace(/\s+/g, ''))}
            >
              <Text style={[styles.menuText, item === 'Action Desk' && styles.activeMenuText]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </DrawerContentScrollView>

      {/* Logout Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2D1A15' }, // Deep dark brown sidebar
  scrollContent: { paddingTop: 40 },
  brandSection: { paddingHorizontal: 24, marginBottom: 30 },
  logo: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  roleBadge: { marginTop: 8 },
  roleText: { color: '#8b9bb4', fontSize: 12, fontWeight: 'bold' },
  menuContainer: { marginTop: 10 },
  menuItem: { paddingVertical: 16, paddingHorizontal: 24, borderLeftWidth: 4, borderLeftColor: 'transparent' },
  activeMenuItem: { backgroundColor: '#3E2723', borderLeftColor: '#D7CCC8' }, // Corporate active state
  menuText: { color: '#a0aec0', fontSize: 16, fontWeight: '600' },
  activeMenuText: { color: '#FFFFFF' },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#3E2723' },
  logoutBtn: { paddingVertical: 10 },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' }
});