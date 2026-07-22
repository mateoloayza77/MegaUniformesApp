import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';
import { isFirebaseConfigured } from '@/constants/firebase';
import { authErrorMessage, useAuth } from '@/context/AuthContext';

const logoImage = require('@/assets/imports/WhatsApp_Image_2026-05-05_at_07.57.26.jpeg');

type Mode = 'login' | 'signup';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim() || !password) {
      setError('Completa el correo y la contraseña.');
      return;
    }
    if (isSignup && !name.trim()) {
      setError('Ingresa tu nombre.');
      return;
    }
    if (!isFirebaseConfigured) {
      setError('Firebase aún no está configurado. Agrega tus claves en el archivo .env.');
      return;
    }

    try {
      setLoading(true);
      if (isSignup) {
        await signUp(name, email, password);
      } else {
        await signIn(email, password);
      }
      goBack();
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Escribe tu correo arriba para enviarte el enlace de recuperación.');
      return;
    }
    if (!isFirebaseConfigured) {
      setError('Firebase aún no está configurado. Agrega tus claves en el archivo .env.');
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert(
        'Correo enviado',
        `Te enviamos un enlace a ${email.trim()} para restablecer tu contraseña.`,
      );
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera navy con logo */}
        <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={goBack} activeOpacity={0.7}>
            <Ionicons name="close" size={26} color={COLORS.white} />
          </TouchableOpacity>

          <Image source={logoImage} style={styles.logo} />
          <Text style={styles.brandMega}>MEGA UNIFORMES</Text>
          <Text style={styles.brandTagline}>Tu tienda de uniformes en Cuenca</Text>
        </View>

        {/* Tarjeta del formulario */}
        <View style={styles.card}>
          <Text style={styles.title}>{isSignup ? 'Crear cuenta' : 'Bienvenido de nuevo'}</Text>
          <Text style={styles.subtitle}>
            {isSignup
              ? 'Regístrate para guardar tus datos y comprar más rápido.'
              : 'Inicia sesión para continuar.'}
          </Text>

          {/* Alternador login / registro */}
          <View style={styles.switcher}>
            <TouchableOpacity
              style={[styles.switchTab, !isSignup && styles.switchTabActive]}
              onPress={() => switchMode('login')}
              activeOpacity={0.8}
            >
              <Text style={[styles.switchText, !isSignup && styles.switchTextActive]}>
                Iniciar sesión
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchTab, isSignup && styles.switchTabActive]}
              onPress={() => switchMode('signup')}
              activeOpacity={0.8}
            >
              <Text style={[styles.switchText, isSignup && styles.switchTextActive]}>
                Registrarme
              </Text>
            </TouchableOpacity>
          </View>

          {!isFirebaseConfigured && (
            <View style={styles.warning}>
              <Ionicons name="warning-outline" size={18} color={COLORS.navy} />
              <Text style={styles.warningText}>
                Firebase no está configurado. Agrega tus claves en el archivo .env para activar el
                login.
              </Text>
            </View>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={COLORS.red} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {isSignup && (
            <View style={styles.field}>
              <Ionicons name="person-outline" size={20} color={COLORS.muted} style={styles.fieldIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor={COLORS.muted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          )}

          <View style={styles.field}>
            <Ionicons name="mail-outline" size={20} color={COLORS.muted} style={styles.fieldIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={COLORS.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.muted} style={styles.fieldIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={COLORS.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={8}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.muted}
              />
            </TouchableOpacity>
          </View>

          {!isSignup && (
            <TouchableOpacity
              style={styles.forgot}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.navy} />
            ) : (
              <Text style={styles.submitText}>
                {isSignup ? 'CREAR CUENTA' : 'INICIAR SESIÓN'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestBtn} onPress={goBack} disabled={loading}>
            <Text style={styles.guestText}>Continuar sin cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.navy },
  scroll: { flexGrow: 1 },

  hero: {
    alignItems: 'center',
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 8,
    zIndex: 2,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    marginTop: 12,
  },
  brandMega: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },
  brandTagline: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },

  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.navy },
  subtitle: { marginTop: 6, fontSize: 14, color: COLORS.muted, lineHeight: 20 },

  switcher: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginTop: 20,
    marginBottom: 4,
  },
  switchTab: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: 'center',
  },
  switchTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  switchText: { fontSize: 14, fontWeight: '700', color: COLORS.muted },
  switchTextActive: { color: COLORS.navy },

  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  warningText: { flex: 1, fontSize: 12.5, color: COLORS.navy, lineHeight: 18 },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  errorText: { flex: 1, fontSize: 13, color: COLORS.red, lineHeight: 18 },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    marginTop: 14,
  },
  fieldIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: COLORS.navy,
  },
  eyeBtn: { padding: 4 },

  forgot: { alignSelf: 'flex-end', marginTop: 12, paddingVertical: 4 },
  forgotText: { fontSize: 13, fontWeight: '600', color: COLORS.navy },

  submitBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 54,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitText: { fontSize: 15, fontWeight: '800', color: COLORS.navy, letterSpacing: 0.5 },

  guestBtn: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  guestText: { fontSize: 14, fontWeight: '600', color: COLORS.muted },
});
