import Feather from '@expo/vector-icons/Feather';
import { fetch } from 'expo/fetch';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { adminColors, adminRadius, adminShadow, adminSpacing } from '@/components/admin/adminTheme';
import { AppFonts } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';
import { CLOUD_API_URL } from '@/services/products-api';

async function submitStoreSettings(token: string, payload: { api_key: string; store_name: string; webhook_secret: string }) {
  return fetch(`${CLOUD_API_URL}/api/admin/stores`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export default function ManageStoresScreen() {
  const auth = useAuth();
  const [apiKey, setApiKey] = useState('pk_live_takt_shop_demo');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [storeName, setStoreName] = useState('Pokémon Takt Shop');
  const [webhookSecret, setWebhookSecret] = useState('whsec_demo');

  async function handleSubmit() {
    if (!auth.token) {
      setMessage('Admin token is missing. Login again before saving store settings.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const response = await submitStoreSettings(auth.token, {
        api_key: apiKey.trim(),
        store_name: storeName.trim(),
        webhook_secret: webhookSecret.trim(),
      });
      if (!response.ok) {
        throw new Error(`Store settings failed (${response.status}).`);
      }
      setMessage('Store settings saved.');
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Could not save store settings.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.page}>
      <View style={styles.panel}>
        <Text style={styles.eyebrow}>Store Routing</Text>
        <Text style={styles.title}>Manage Stores</Text>
        <Text style={styles.subtitle}>Keep storefront names and private service keys ready for backend integration.</Text>

        <View style={styles.form}>
          <LabeledInput label="Store Name" onChangeText={setStoreName} value={storeName} />
          <LabeledInput label="API Key" onChangeText={setApiKey} value={apiKey} />
          <LabeledInput label="Webhook Secret" onChangeText={setWebhookSecret} secureTextEntry value={webhookSecret} />
        </View>

        {message ? (
          <View style={styles.notice}>
            <Feather name="info" size={16} color={adminColors.primary} />
            <Text style={styles.noticeText}>{message}</Text>
          </View>
        ) : null}

        <Pressable disabled={saving} onPress={() => void handleSubmit()} style={[styles.primaryButton, saving && styles.disabledButton]}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Feather name="save" size={16} color="#FFFFFF" />}
          <Text style={styles.primaryButtonText}>Save Store</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function LabeledInput({
  label,
  ...props
}: {
  label: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  value: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput {...props} autoCapitalize="none" placeholderTextColor={adminColors.muted} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: adminSpacing.xl,
  },
  disabledButton: {
    opacity: 0.68,
  },
  eyebrow: {
    color: adminColors.primary,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  form: {
    gap: adminSpacing.md,
    marginVertical: adminSpacing.xl,
  },
  input: {
    backgroundColor: adminColors.panel,
    borderColor: adminColors.borderStrong,
    borderRadius: adminRadius.control,
    borderWidth: 1,
    color: adminColors.text,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: adminSpacing.md,
  },
  inputGroup: {
    gap: adminSpacing.sm,
  },
  inputLabel: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  notice: {
    alignItems: 'center',
    backgroundColor: adminColors.primarySoft,
    borderColor: adminColors.border,
    borderRadius: adminRadius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.sm,
    marginBottom: adminSpacing.md,
    padding: adminSpacing.md,
  },
  noticeText: {
    color: adminColors.text,
    flex: 1,
    fontFamily: AppFonts.bodyBold,
    fontSize: 13,
  },
  page: {
    backgroundColor: adminColors.background,
    flex: 1,
  },
  panel: {
    ...adminShadow,
    backgroundColor: adminColors.panel,
    borderColor: adminColors.border,
    borderRadius: adminRadius.card,
    borderWidth: 1,
    maxWidth: 680,
    padding: adminSpacing.xl,
  },
  primaryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: adminColors.primary,
    borderRadius: adminRadius.control,
    flexDirection: 'row',
    gap: adminSpacing.sm,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: adminSpacing.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
  subtitle: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 15,
    lineHeight: 24,
    marginTop: adminSpacing.sm,
  },
  title: {
    color: adminColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 34,
    lineHeight: 40,
    marginTop: adminSpacing.xs,
  },
});
