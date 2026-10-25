import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Message, Msg } from '../components/message';
import { emailExists } from '../data/userStore';
import { colors } from '../theme/colors';
import { styles } from '../theme/styles';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<Msg>(null);

  const handleReset = () => {
    const mail = email.trim().toLowerCase();
    if (!mail) {
      setMsg({ text: 'Email harus diisi.', ok: false });
    } else if (!emailExists(mail)) {
      setMsg({ text: 'Email tidak terdaftar.', ok: false });
    } else {
      setMsg({ text: `Link reset password telah dikirim ke ${mail}.`, ok: true });
    }
  };

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Lupa Password</Text>
          <Text style={styles.subtitle}>
            Masukkan email yang terdaftar untuk menerima link reset password.
          </Text>
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

          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Kirim Link Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={[styles.link, styles.center]}>Kembali ke Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}