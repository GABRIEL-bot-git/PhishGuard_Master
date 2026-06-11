import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard, Alert } from 'react-native';
import axios from 'axios';

export default function DashboardScreen({ route, navigation }) {
  const [scanType, setScanType] = useState('url'); 
  const [payload, setPayload] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // FIXED: Catches both casing styles from login routing
  const userId = route?.params?.userId || route?.params?.user_id || 1;
  const API_BASE_URL = 'https://phishguard-api-cp0t.onrender.com'; 

  const handleScan = async () => {
    if (!payload.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    setResult(null);

    try {
      const endpoint = scanType === 'url' ? '/api/v1/scan/url' : '/api/v1/scan/sms';
      const requestData = scanType === 'url' ? { url: payload, user_id: userId } : { message: payload, user_id: userId };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, requestData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Scan Failed", "Could not connect to the cloud server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          onLongPress={() => {
            if (Number(userId) === 1) {
              navigation.navigate('Admin');
            } else {
              Alert.alert("Access Denied", `Administrator privileges required. (ID: ${userId})`);
            }
          }} 
          delayLongPress={2000}
        >
          <Text style={styles.header}>AI Threat Scanner</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featureNavRow}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('History', { userId })}>
          <Text style={styles.navButtonText}>📜 My History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('QRScanner', { userId })}>
          <Text style={styles.navButtonText}>📷 Scan QR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, scanType === 'url' && styles.activeTab]} 
          onPress={() => { setScanType('url'); setPayload(''); setResult(null); }}
        >
          <Text style={[styles.tabText, scanType === 'url' && styles.activeTabText]}>Scan URL</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, scanType === 'sms' && styles.activeTab]} 
          onPress={() => { setScanType('sms'); setPayload(''); setResult(null); }}
        >
          <Text style={[styles.tabText, scanType === 'sms' && styles.activeTabText]}>Scan SMS Text</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={scanType === 'url' ? "Paste suspicious link here (e.g., http://bit.ly/...)" : "Paste suspicious text message here..."}
        value={payload}
        onChangeText={setPayload}
        multiline={scanType === 'sms'}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.scanButton} onPress={handleScan} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.scanButtonText}>Analyze Threat</Text>}
      </TouchableOpacity>

      {result && (
        <View style={[styles.resultCard, result.classification === 'Phishing' ? styles.cardRed : styles.cardGreen]}>
          <Text style={styles.resultTitle}>
            {result.classification === 'Phishing' ? '🚨 DANGER: PHISHING DETECTED' : '✅ SAFE: NO THREAT DETECTED'}
          </Text>
          <Text style={styles.resultDetail}>AI Certainty: {result.threat_probability}</Text>
          <Text style={styles.resultTarget} numberOfLines={2}>Scanned: {result.target}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9', paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e' },
  logoutText: { color: '#e94560', fontWeight: 'bold' },
  featureNavRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  navButton: { flex: 0.48, backgroundColor: '#e0e0e0', padding: 12, borderRadius: 8, alignItems: 'center' },
  navButtonText: { color: '#1a1a2e', fontWeight: 'bold', fontSize: 14 },
  tabContainer: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#e0e0e0', borderRadius: 8, padding: 4 },
  tab: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  tabText: { color: '#666', fontWeight: 'bold' },
  activeTabText: { color: '#0f3460' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', minHeight: 60, marginBottom: 15, textAlignVertical: 'top' },
  scanButton: { backgroundColor: '#0f3460', padding: 16, borderRadius: 8, alignItems: 'center' },
  scanButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultCard: { marginTop: 30, padding: 20, borderRadius: 10, borderWidth: 2 },
  cardRed: { backgroundColor: '#ffe6e6', borderColor: '#e94560' },
  cardGreen: { backgroundColor: '#e6ffe6', borderColor: '#28a745' },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#1a1a2e' },
  resultDetail: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  resultTarget: { fontSize: 14, color: '#666', fontStyle: 'italic' }
});