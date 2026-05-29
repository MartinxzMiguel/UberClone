import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || '');
            setPhone(data.phone || '');
            setGender(data.gender || '');
            setLanguage(data.language || '');
          }
        } catch (error) {
          console.log(error);
        }
      };
      loadProfile();
    }
  }, []);

  const handleSave = async () => {
    if (!name || name.length > 50) {
      Alert.alert('Error', 'El nombre no es válido');
      return;
    }
    if (!phone || isNaN(phone) || phone.length < 7) {
      Alert.alert('Error', 'El teléfono no es válido');
      return;
    }

    try {
      setLoading(true);
      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        gender,
        language,
        email: user.email,
        updatedAt: new Date(),
      }, { merge: true });
      Alert.alert('✅ Perfil guardado', 'Tus datos fueron actualizados');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => auth.signOut() }
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name ? name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <Text style={styles.emailText}>{name || user?.email}</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputDisabledText}>{user?.email}</Text>
          </View>

          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#aaa"
            onChangeText={setName}
            value={name}
            maxLength={50}
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu número de teléfono"
            placeholderTextColor="#aaa"
            onChangeText={setPhone}
            value={phone}
            keyboardType="phone-pad"
            maxLength={15}
          />

          {/* Género */}
          <Text style={styles.label}>Género</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={gender}
              onValueChange={(value) => setGender(value)}
              style={styles.picker}
              dropdownIconColor="#aaa"
            >
              <Picker.Item label="Seleccionar género" value="" color="#aaa" />
              <Picker.Item label="Hombre" value="hombre" />
              <Picker.Item label="Mujer" value="mujer" />
              <Picker.Item label="Otro" value="otro" />
            </Picker>
          </View>

          {/* Idioma */}
          <Text style={styles.label}>Idioma</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={language}
              onValueChange={(value) => setLanguage(value)}
              style={styles.picker}
              dropdownIconColor="#aaa"
            >
              <Picker.Item label="Seleccionar idioma" value="" color="#aaa" />
              <Picker.Item label="Español" value="es" />
              <Picker.Item label="Inglés" value="en" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  emailText: {
    fontSize: 14,
    color: '#888',
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#fafafa',
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#f0f0f0',
  },
  inputDisabledText: {
    fontSize: 15,
    color: '#888',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  picker: {
    height: 52,
    color: '#111',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ff3b30',
    fontSize: 15,
    fontWeight: '600',
  },
});