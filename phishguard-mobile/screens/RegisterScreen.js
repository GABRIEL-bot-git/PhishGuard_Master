import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Keyboard } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // REPLACE WITH YOUR ACTUAL IPV4 ADDRESS
  const API_BASE_URL = 'https://phishguard-api-cp0t.onrender.com';

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, {
        full_name: name,
        email: email.trim(),
        password: password
      });

      Alert.alert('Success', 'Account created successfully! Please log in.');
      navigation.navigate('Login');
      
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Registration Failed', 'That email is already registered.');
      } else {
        Alert.alert('Network Error', 'Could not connect to the server. Is your Python API running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Log in.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f4f9' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#1a1a2e', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#e94560', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkText: { color: '#0f3460', textAlign: 'center', marginTop: 20, fontSize: 14 }
});