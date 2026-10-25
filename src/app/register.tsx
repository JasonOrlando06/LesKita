import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GoogleIcon } from '../components/googleIcon';
import { Message, Msg } from '../components/message';
import { PasswordInput } from '../components/passwordInput';
import { auth, db } from '../lib/firebase';
import { colors } from '../theme/colors';
import { styles } from '../theme/styles';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
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
          const result = await signInWithCredential(auth, credential);
          await setDoc(
            doc(db, 'users', result.user.uid),
            {
              name: result.user.displayName ?? '',
              email: result.user.email ?? '',
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
          setMsg({ text: 'Daftar dengan Google berhasil!', ok: true });
        } catch (error) {
          setMsg({ text: 'Gagal daftar dengan Google.', ok: false });
        } finally {
          setLoading(false);
        }
      }
    };
    handleGoogleResponse();
  }, [response]);

  const handleRegister = async () => {
    const fullName = name.trim();
    const mail = email.trim();

    if (!fullName || !mail || !password || !confirm) {
      setMsg({ text: 'Semua kolom harus diisi.', ok: false });
      return;
    }
    if (password.length < 6) {
      setMsg({ text: 'Password minimal 6 karakter.', ok: false });
      return;
    }
    if (password !== confirm) {
      setMsg({ text: 'Konfirmasi password tidak sama.', ok: false });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, mail, password);
      await updateProfile(result.user, { displayName: fullName });
      await setDoc(doc(db, 'users', result.user.uid), {
        name: fullName,
        email: mail,
        createdAt: serverTimestamp(),
      });
      router.replace('/');
    } catch (error: any) {
      let text = 'Terjadi kesalahan. Coba lagi.';
      if (error.code === 'auth/email-already-in-use') {
        text = 'Email sudah terdaftar.';
      } else if (error.code === 'auth/invalid-email') {
        text = 'Format email tidak valid.';
      } else if (error.code === 'auth/weak-password') {
        text = 'Password terlalu lemah.';
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
          <Text style={styles.title}>Daftar</Text>
          <Message msg={msg} />
          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
          />
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
          <PasswordInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Konfirmasi password"
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Memproses...' : 'Daftar'}</Text>
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
              Daftar dengan Google
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.rowText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
