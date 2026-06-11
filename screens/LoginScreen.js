import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Keyboard } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://phishguard-api-cp0t.onrender.com';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter your email and password.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
        email: email.trim(),
        password: password
      });

      const databaseUserId = response.data.user_id;

      navigation.replace('Dashboard', { userId: databaseUserId });

    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Access Denied', 'Invalid email or password.');
      } else {
        Alert.alert('Network Error', 'Could not connect to the server. Check your Wi-Fi and IP address.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>PhishGuard AI</Text>
      <Text style={styles.subHeader}>Secure Login</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register here.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f4f9' },
  header: { fontSize: 32, fontWeight: 'bold', color: '#1a1a2e', textAlign: 'center', marginBottom: 5 },
  subHeader: { fontSize: 18, color: '#16213e', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#0f3460', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkText: { color: '#0f3460', textAlign: 'center', marginTop: 20, fontSize: 14 }
});