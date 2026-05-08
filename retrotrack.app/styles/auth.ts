import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1B1E',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inner: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    maxWidth: 360,
    alignSelf: 'center',
    width: '100%',
  },
  innerLogin: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    maxWidth: 360,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c1c2c5',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleLogin: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#c1c2c5',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#909296',
    textAlign: 'center',
    marginBottom: 28,
  },
  subtitleLogin: {
    fontSize: 14,
    color: '#909296',
    textAlign: 'center',
    marginBottom: 32,
  },
  error: {
    color: '#fa5252',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 13,
  },
  input: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#c1c2c5',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonPressed: {
    backgroundColor: '#1565c0',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#74c0fc',
    fontSize: 14,
  },
});
