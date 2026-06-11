import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

export default function AdminScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLogs, setUserLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

  const API_BASE_URL = 'https://phishguard-api-cp0t.onrender.com';

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Admin Error", "Failed to retrieve registered user database registry.");
    } finally {
      setLoading(false);
    }
  };

  const viewUserHistory = async (user) => {
    setSelectedUser(user);
    setLogsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/user-history/${user.user_id}`);
      setUserLogs(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to compile log telemetry for this user.");
    } finally {
      setLogsLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0f3460" /></View>;

  return (
    <View style={styles.container}>
      {/* Dynamic View switching based on state */}
      {!selectedUser ? (
        <>
          <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
            <Text style={styles.backLinkText}>⬅ Back to Dashboard</Text>
          </TouchableOpacity>
          <Text style={styles.header}>System User Directory</Text>
          <Text style={styles.subHeader}>Tap any user to audit their cloud scan logs</Text>
          
          {users.length === 0 ? (
            <Text style={styles.emptyText}>No registered standard users found in database.</Text>
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item.user_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.userCard} onPress={() => viewUserHistory(item)}>
                  <Text style={styles.userNameText}>👤 {item.full_name}</Text>
                  <Text style={styles.userEmailText}>✉️ {item.email}</Text>
                  <Text style={styles.userIdTag}>User ID: {item.user_id}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.backLink} onPress={() => { setSelectedUser(null); setUserLogs([]); }}>
            <Text style={styles.backLinkText}>⬅ Back to User Directory</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Audit Log: {selectedUser.full_name}</Text>
          <Text style={styles.subHeader}>Reviewing telemetry for {selectedUser.email}</Text>

          {logsLoading ? (
            <ActivityIndicator size="large" color="#0f3460" style={{ marginTop: 40 }} />
          ) : userLogs.length === 0 ? (
            <Text style={styles.emptyText}>This user has not scanned any payloads yet.</Text>
          ) : (
            <FlatList
              data={userLogs}
              keyExtractor={(item) => item.log_id.toString()}
              renderItem={({ item }) => (
                <View style={[styles.logCard, item.classification === 'Phishing' ? styles.cardRed : styles.cardGreen]}>
                  <Text style={styles.logPayload} numberOfLines={1}>{item.payload_content}</Text>
                  <View style={styles.row}>
                    <Text style={styles.logDetail}>Type: {item.payload_type}</Text>
                    <Text style={styles.logDetail}>AI Certainty: {item.threat_probability}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={[styles.statusText, item.classification === 'Phishing' ? styles.textRed : styles.textGreen]}>
                      Classification: {item.classification}
                    </Text>
                    {item.is_reported === 1 && <Text style={styles.reportedBadge}>⚠️ USER REPORTED FALSE NEGATIVE</Text>}
                  </View>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9', paddingTop: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backLink: { marginBottom: 15, paddingVertical: 5 },
  backLinkText: { color: '#0f3460', fontWeight: 'bold', fontSize: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e' },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 20 },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 30, fontStyle: 'italic' },
  userCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#ddd', elevation: 1 },
  userNameText: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e' },
  userEmailText: { fontSize: 14, color: '#555', marginTop: 2 },
  userIdTag: { fontSize: 12, color: '#999', marginTop: 5, textAlign: 'right' },
  logCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 12, borderWidth: 1 },
  cardRed: { borderColor: '#e94560' },
  cardGreen: { borderColor: '#28a745' },
  logPayload: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  logDetail: { fontSize: 13, color: '#666' },
  statusText: { fontSize: 14, fontWeight: 'bold' },
  textRed: { color: '#e94560' },
  textGreen: { color: '#28a745' },
  reportedBadge: { color: '#ff9800', fontWeight: 'bold', fontSize: 11, backgroundColor: '#fff3e0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }
});