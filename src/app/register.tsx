import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Message, Msg } from '../components/message';
import { PasswordInput } from '../components/passwordInput';
import { addUser, emailExists, usernameExists } from '../data/userStore';
import { colors } from '../theme/colors';
import { styles } from '../theme/styles';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<Msg>(null);

  const handleRegister = () => {
    const name = username.trim();
    const mail = email.trim().toLowerCase();

    if (!name || !mail || !password || !confirm) {
      setMsg({ text: 'Semua kolom harus diisi.', ok: false });
    } else if (!/^\S+@\S+\.\S+$/.test(mail)) {
      setMsg({ text: 'Format email tidak valid.', ok: false });
    } else if (password.length < 6) {
      setMsg({ text: 'Password minimal 6 karakter.', ok: false });
    } else if (password !== confirm) {
      setMsg({ text: 'Konfirmasi password tidak sama.', ok: false });
    } else if (usernameExists(name)) {
      setMsg({ text: 'Username sudah dipakai.', ok: false });
    } else if (emailExists(mail)) {
      setMsg({ text: 'Email sudah terdaftar.', ok: false });
    } else {
      addUser({ username: name, email: mail, password });
      router.replace('/');
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
            placeholder="Username"
            placeholderTextColor={colors.muted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
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

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Daftar</Text>
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