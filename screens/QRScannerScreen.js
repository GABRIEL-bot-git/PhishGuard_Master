import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';

export default function QRScannerScreen({ route, navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const userId = route?.params?.userId || route?.params?.user_id || 1;
  const API_BASE_URL = 'https://phishguard-api-cp0t.onrender.com';

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>Camera hardware authorization required for scanning operations.</Text>
        <Button onPress={requestPermission} title="Grant Hardware Access" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/scan/url`, { url: data, user_id: userId });
      setResult(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to connect to active threat prediction node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* TOP DECK BACKLINK FOR WEB/UI ESCAPE PATHWAY */}
      <View style={styles.navOverlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>⬅ Exit to Dashboard</Text>
        </TouchableOpacity>
      </View>

      {!scanned ? (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      ) : (
        <View style={styles.resultContainer}>
          {loading ? (
             <ActivityIndicator size="large" color="#0f3460" />
          ) : result && (
            <View style={[styles.resultCard, result.classification === 'Phishing' ? styles.cardRed : styles.cardGreen]}>
              <Text style={styles.resultTitle}>
                {result.classification === 'Phishing' ? '🚨 DANGER: PHISHING QR ENCRYPTED' : '✅ SAFE DECRYPTED TARGET'}
              </Text>
              <Text style={styles.resultDetail}>AI Certainty Matrix: {result.threat_probability}</Text>
              <Text style={styles.resultTarget}>Decoded String: {result.target}</Text>
              <Button title="Scan Alternative Token" onPress={() => { setScanned(false); setResult(null); }} />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', padding: 20 },
  navOverlay: { position: 'absolute', top: 40, left: 20, right: 20, zIndex: 10, flexDirection: 'row' },
  backButton: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, borderStyle: 'solid', borderWidth: 1, borderColor: '#fff' },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f9', padding: 20 },
  resultCard: { padding: 20, borderRadius: 10, borderWidth: 2, width: '100%', alignItems: 'center', backgroundColor: '#fff' },
  cardRed: { backgroundColor: '#ffe6e6', borderColor: '#e94560' },
  cardGreen: { backgroundColor: '#e6ffe6', borderColor: '#28a745' },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#1a1a2e' },
  resultDetail: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  resultTarget: { fontSize: 14, color: '#666', fontStyle: 'italic', marginBottom: 20, textAlign: 'center' }
});