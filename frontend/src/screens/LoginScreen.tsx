import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    setError(null);
    try {
      await signIn(email, password);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || 'Login failed');
    }
  };

  const onRegister = async () => {
    setError(null);
    try {
      await signUp(email, password);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Monolith</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Sign In" onPress={onLogin} />
      <View style={{ height: 10 }} />
      <Button title="Create account" onPress={onRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 8, marginBottom: 8, borderRadius: 4 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  error: { color: 'red', marginBottom: 8 },
});