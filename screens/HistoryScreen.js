import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

export default function HistoryScreen({ route, navigation }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // FIXED: Handles accurate user tracking variables
  const userId = route?.params?.userId || route?.params?.user_id || 1;
  const API_BASE_URL = 'https://phishguard-api-cp0t.onrender.com';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/history/${userId}`);
      setLogs(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not fetch history tracking telemetry.");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (logId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/v1/report/${logId}`);
      Alert.alert("Success", "Threat successfully logged and reported to admin.");
      fetchHistory();
    } catch (error) {
      Alert.alert("Error", "Could not submit system threat report.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.classification === 'Phishing' ? styles.cardRed : styles.cardGreen]}>
      <Text style={styles.targetText} numberOfLines={1}>{item.payload_content}</Text>
      <View style={styles.row}>
        <Text style={styles.detailText}>Type: {item.payload_type}</Text>
        <Text style={styles.detailText}>AI Certainty: {item.threat_probability}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.statusText, item.classification === 'Phishing' ? styles.textRed : styles.textGreen]}>
          {item.classification}
        </Text>
        
        {item.classification === 'Safe' && item.is_reported === 0 && (
          <TouchableOpacity style={styles.reportBtn} onPress={() => handleReport(item.log_id)}>
            <Text style={styles.reportBtnText}>Report Threat ⚠️</Text>
          </TouchableOpacity>
        )}
        {item.is_reported === 1 && <Text style={styles.reportedText}>Flagged & Reported</Text>}
      </View>
    </View>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0f3460" /></View>;

  return (
    <View style={styles.container}>
      {/* PROFESSIONAL NAVIGATION LINK BACK TO DASHBOARD */}
      <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
        <Text style={styles.backLinkText}>⬅ Back to Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Scan History Telemetry</Text>
      {logs.length === 0 ? (
        <Text style={styles.emptyText}>No previous scan telemetry logged for this session.</Text>
      ) : (
        <FlatList data={logs} keyExtractor={(item) => item.log_id.toString()} renderItem={renderItem} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9', paddingTop: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backLink: { marginBottom: 15, paddingVertical: 5 },
  backLinkText: { color: '#0f3460', fontWeight: 'bold', fontSize: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1a1a2e' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 20 },
  card: { padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, backgroundColor: '#fff', elevation: 1 },
  cardRed: { borderColor: '#e94560' },
  cardGreen: { borderColor: '#28a745' },
  targetText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  detailText: { fontSize: 14, color: '#666' },
  statusText: { fontSize: 16, fontWeight: 'bold' },
  textRed: { color: '#e94560' },
  textGreen: { color: '#28a745' },
  reportBtn: { backgroundColor: '#ff9800', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5 },
  reportBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  reportedText: { color: '#e94560', fontSize: 12, fontWeight: 'bold', fontStyle: 'italic' }
});