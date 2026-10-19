import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Message, Msg } from '../components/message';
import { PasswordInput } from '../components/passwordInput';
import { auth } from '../lib/firebase';
import { colors } from '../theme/colors';
import { styles } from '../theme/styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<Msg>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === '' || password === '') {
      setMsg({ text: 'Email dan password harus diisi.', ok: false });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      setMsg({ text: `Login berhasil. Selamat datang kembali!`, ok: true });
      // Command di bawah akan digunakan ketika page HOME dibuat:
      // router.replace('/home');
      console.log('Logged in user:', result.user.uid);
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