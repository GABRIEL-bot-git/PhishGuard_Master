import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function AdminDashboardScreen({ navigation }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalScans, setTotalScans] = useState(0);

  // REPLACE WITH YOUR ACTUAL IPV4 ADDRESS
  const API_BASE_URL = 'https://phishguard-api-cp0t.onrender.com';

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/logs`);
      setLogs(response.data.logs);
      setTotalScans(response.data.total_scans);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  const renderLogCard = ({ item }) => (
    <View style={[styles.card, item.classification === 'Phishing' ? styles.cardRed : styles.cardGreen]}>
      <View style={styles.cardHeader}>
        <Text style={styles.logUser}>Scanned by: {item.full_name}</Text>
        <Text style={styles.logTime}>{new Date(item.scan_time).toLocaleString()}</Text>
      </View>
      <Text style={styles.logType}>Type: {item.payload_type}</Text>
      <Text style={styles.logTarget} numberOfLines={2}>Target: {item.payload_content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.logClass}>{item.classification.toUpperCase()}</Text>
        <Text style={styles.logProb}>Certainty: {item.threat_probability}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>System Overview</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsText}>Total Network Scans Processed</Text>
        <Text style={styles.statsNumber}>{totalScans}</Text>
      </View>

      <Text style={styles.subHeader}>Live Threat Feed</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0f3460" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.log_id.toString()}
          renderItem={renderLogCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={loading}
          onRefresh={fetchLogs}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f9', paddingTop: 50, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { marginRight: 15, padding: 5 },
  backText: { color: '#e94560', fontWeight: 'bold', fontSize: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e' },
  statsCard: { backgroundColor: '#0f3460', padding: 20, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  statsText: { color: '#fff', fontSize: 16, opacity: 0.8 },
  statsNumber: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 5 },
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 10 },
  card: { padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, backgroundColor: '#fff' },
  cardRed: { borderColor: '#e94560', borderLeftWidth: 5 },
  cardGreen: { borderColor: '#28a745', borderLeftWidth: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  logUser: { fontWeight: 'bold', color: '#333' },
  logTime: { fontSize: 12, color: '#888' },
  logType: { fontSize: 12, color: '#666', marginBottom: 5, fontStyle: 'italic' },
  logTarget: { fontSize: 14, color: '#444', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  logClass: { fontWeight: 'bold', color: '#1a1a2e' },
  logProb: { color: '#e94560', fontWeight: 'bold' }
});