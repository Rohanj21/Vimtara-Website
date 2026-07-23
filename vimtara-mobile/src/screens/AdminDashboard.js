import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Command Center</Text>
          <Text style={styles.headerSubtitle}>System Governance & RBAC</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ padding: 16 }}>
        {/* Metric Cards */}
        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>142</Text>
            <Text style={styles.metricLbl}>Active Users</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}> Pinecone</Text>
            <Text style={styles.metricLbl}>Cloud Vector Engine</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>System Controls</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>👥 User Role Permissions (RBAC)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>⚡ Pinecone Knowledge Base Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>📊 Statutory Audit Logs</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#c62828' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#ffcdd2', fontSize: 12 },
  logoutBtn: { backgroundColor: '#b71c1c', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  metricRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  metricCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  metricVal: { fontSize: 20, fontWeight: 'bold', color: '#c62828' },
  metricLbl: { color: '#64748b', fontSize: 12, marginTop: 4 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 },
  menuItem: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 1 },
  menuText: { fontSize: 15, fontWeight: '600', color: '#334155' }
});