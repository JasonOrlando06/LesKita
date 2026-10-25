import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GoogleIcon } from '../components/googleIcon';
import { Message, Msg } from '../components/message';
import { PasswordInput } from '../components/passwordInput';
import { auth } from '../lib/firebase';
import { colors } from '../theme/colors';
import { styles } from '../theme/styles';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<Msg>(null);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '826915862685-10n728nf6n1aqiveo1nb4o40bj9b8up4.apps.googleusercontent.com',
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        setLoading(true);
        try {
          await signInWithCredential(auth, credential);
          setMsg({ text: 'Login dengan Google berhasil!', ok: true });
        } catch (error) {
          setMsg({ text: 'Gagal login dengan Google.', ok: false });
        } finally {
          setLoading(false);
        }
      }
    };
    handleGoogleResponse();
  }, [response]);

  const handleLogin = async () => {
    if (email.trim() === '' || password === '') {
      setMsg({ text: 'Email dan password harus diisi.', ok: false });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setMsg({ text: 'Login berhasil. Selamat datang kembali!', ok: true });
      // router.replace('/home');
    } catch (error: any) {
      let text = 'Terjadi kesalahan. Coba lagi.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        text = 'Email atau password salah.';
      } else if (error.code === 'auth/user-not-found') {
        text = 'Akun dengan email ini tidak ditemukan.';
      } else if (error.code === 'auth/invalid-email') {
        text = 'Format email tidak valid.';
      } else if (error.code === 'auth/too-many-requests') {
        text = 'Terlalu banyak percobaan. Coba lagi nanti.';
      }
      setMsg({ text, ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>
          <Message msg={msg} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <PasswordInput value={password} onChangeText={setPassword} placeholder="Password" />

          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={styles.linkRight}>Lupa password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Memproses...' : 'Masuk'}</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <Text style={{ marginHorizontal: 8, color: colors.muted }}>atau</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
            onPress={() => promptAsync()}
            disabled={!request || loading}
          >
            <GoogleIcon size={20} />
            <Text style={{ color: colors.text, fontWeight: '600', marginLeft: 10 }}>
              Masuk dengan Google
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.rowText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.link}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
