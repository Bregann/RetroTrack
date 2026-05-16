import { useAuth } from '@/context/authContext';
import { authStyles } from '@/styles/auth';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { attemptLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    const success = await attemptLogin(username.trim(), password);
    setLoading(false);

    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={authStyles.innerLogin}>
        <Text style={authStyles.titleLogin}>RetroTrack</Text>
        <Text style={authStyles.subtitleLogin}>Sign in to your account</Text>

        {error !== '' && <Text style={authStyles.error}>{error}</Text>}

        <TextInput
          style={authStyles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />

        <View style={authStyles.passwordContainer}>
          <TextInput
            style={authStyles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity
            style={authStyles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[authStyles.button, loading && authStyles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={authStyles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={authStyles.linkButton}>
            <Text style={authStyles.linkText}>Don&apos;t have an account? Register</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
