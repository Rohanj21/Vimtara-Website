import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function AssistantDashboard() {
  const { logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([
    { id: '101', client: 'Acme Corp', type: 'GST Reconciliation', status: 'Pending Review' },
    { id: '102', client: 'Vimtara Legal', type: 'Cap Table Audit', status: 'Pending Approval' }
  ]);

  const handleAction = (id, action) => {
    Alert.alert("Task Action", `Task ${id} has been ${action}`);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Assistant Workspace</Text>
          <Text style={styles.headerSubtitle}>Task Review & Client Queue</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ padding: 16 }}>
        <Text style={styles.sectionHeader}>Assigned Tasks ({tasks.length})</Text>

        {tasks.map(task => (
          <View key={task.id} style={styles.taskCard}>
            <Text style={styles.clientName}>{task.client}</Text>
            <Text style={styles.taskType}>{task.type}</Text>
            
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.btn, styles.approveBtn]} 
                onPress={() => handleAction(task.id, 'APPROVED')}
              >
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.btn, styles.rejectBtn]} 
                onPress={() => handleAction(task.id, 'REJECTED')}
              >
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#1565c0' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#bbdefb', fontSize: 12 },
  logoutBtn: { backgroundColor: '#0d47a1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 },
  taskCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  clientName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  taskType: { color: '#64748b', marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  approveBtn: { backgroundColor: '#2e7d32' },
  rejectBtn: { backgroundColor: '#c62828' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});