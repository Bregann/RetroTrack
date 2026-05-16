import { useAuth } from '@/context/authContext';
import { authStyles } from '@/styles/auth';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const { attemptRegister } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!username.trim() || !password.trim() || !apiKey.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await attemptRegister(username.trim(), password, apiKey.trim());
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={authStyles.inner}>
          <Text style={authStyles.title}>Create Account</Text>
          <Text style={authStyles.subtitle}>Join RetroTrack</Text>

          {error !== '' && <Text style={authStyles.error}>{error}</Text>}

          <TextInput
            style={authStyles.input}
            placeholder="RetroAchievements Username"
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

          <View style={authStyles.passwordContainer}>
            <TextInput
              style={authStyles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <TextInput
            style={authStyles.input}
            placeholder="RetroAchievements API Key"
            placeholderTextColor="#888"
            autoCapitalize="none"
            autoCorrect={false}
            value={apiKey}
            onChangeText={setApiKey}
            editable={!loading}
          />

          <TouchableOpacity
            style={[authStyles.button, loading && authStyles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={authStyles.linkButton}>
              <Text style={authStyles.linkText}>Already have an account? Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
