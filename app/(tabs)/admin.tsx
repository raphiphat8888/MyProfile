import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { AppColors, AppFonts } from '@/constants/Colors';
import { useProducts } from '@/hooks/use-products';
import { login as loginToApi, type AuthUser } from '@/services/auth-api';

type Role = 'trainer' | 'officer';

export default function AdminScreen() {
  const router = useRouter();
  const { products } = useProducts();
  const [role, setRole] = useState<Role>('trainer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [preview, setPreview] = useState(false);

  const stockTotal = useMemo(() => products.reduce((sum, item) => sum + item.stock, 0), [products]);
  const lowStock = products.filter((item) => item.badge_status === 'Low in stock');

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await loginToApi(email, password);
      if (role === 'officer' && result.user.role !== 'admin') {
        setError('This account does not have Store Officer access.');
        return;
      }
      if (role === 'trainer') {
        router.replace('/');
        return;
      }
      setUser(result.user);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const showDashboard = Boolean(user) || preview;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title={showDashboard ? 'Dashboard' : 'Profile'} searchPlaceholder="Search inventory..." />
      {showDashboard ? (
        <ScrollView contentContainerStyle={styles.dashboardContent}>
          <View style={styles.dashboardHeading}>
            <View><Text style={styles.dashboardTitle}>Dashboard Overview</Text><Text style={styles.dashboardSubtitle}>Welcome back, {user?.name ?? 'Store Officer'}. Here&apos;s what&apos;s happening today.</Text></View>
            <Pressable onPress={() => { setUser(null); setPreview(false); }}><Text style={styles.logout}>Log out</Text></Pressable>
          </View>

          <View style={styles.metricGrid}>
            <MetricCard label="TODAY'S REVENUE" value="$4,250.00" note="↗ +12% from yesterday" icon="cash-multiple" tint="#FFF4BA" />
            <MetricCard label="CARDS IN STOCK" value={String(stockTotal)} note={`${products.length} products in the catalog`} icon="truck-outline" tint="#E8EDFF" />
            <MetricCard label="LOW-STOCK ALERTS" value={`${lowStock.length} Items`} note={lowStock.map((item) => item.name).join(' · ') || 'All products have healthy stock'} icon="alert-outline" tint="#FFDFE0" danger />
          </View>

          <View style={styles.managerGrid}>
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>♙ Quick Stock Manager</Text>
              <View style={styles.tableHeader}><Text style={styles.tableLabel}>CARD NAME</Text><Text style={styles.tableLabel}>SET</Text><Text style={styles.tableLabel}>STOCK</Text></View>
              {products.map((product) => (
                <View key={product.id} style={styles.stockRow}>
                  <View style={styles.stockIcon}><MaterialCommunityIcons name={/fire|charizard/i.test(product.name) ? 'fire' : 'lightning-bolt'} size={14} color={AppColors.accent} /></View>
                  <Text style={styles.stockName}>{product.name}</Text><Text style={styles.stockSet}>{product.category}</Text><View style={styles.stockCount}><Text style={styles.stockCountText}>{product.stock}</Text></View>
                </View>
              ))}
            </View>

            <View style={styles.addPanel}>
              <Text style={styles.addTitle}>⊞ Add New Single</Text>
              <Text style={styles.fieldLabel}>CARD NAME</Text><TextInput editable={false} style={styles.input} placeholder="e.g. Mewtwo EX" placeholderTextColor={AppColors.subtleText} />
              <View style={styles.fieldRow}><View style={styles.fieldHalf}><Text style={styles.fieldLabel}>SET</Text><TextInput editable={false} style={styles.input} placeholder="e.g. 151" /></View><View style={styles.fieldHalf}><Text style={styles.fieldLabel}>TYPE</Text><TextInput editable={false} style={styles.input} placeholder="Fire" /></View></View>
              <Button label="Add to Inventory" onPress={() => router.push('/add')} />
            </View>
          </View>

          <Text style={styles.orderHeading}>▦ Order Queue</Text>
          {[['#9823', '3 items · $145.50 · 2 hours ago', 'Packing'], ['#9822', '1 item · $450.00 · 5 hours ago', 'Pending']].map(([id, note, status]) => (
            <View key={id} style={styles.orderCard}><View style={styles.orderIcon}><MaterialCommunityIcons name="account-outline" size={19} color={AppColors.text} /></View><View style={styles.orderCopy}><Text style={styles.orderTitle}>Order {id}</Text><Text style={styles.orderNote}>{note}</Text><View style={styles.orderStatus}><Text style={styles.orderStatusText}>{status}</Text><MaterialCommunityIcons name="chevron-down" size={17} color={AppColors.mutedText} /></View></View><View style={styles.eye}><MaterialCommunityIcons name="eye-outline" size={19} color={AppColors.text} /></View></View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.loginContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.welcome}>Welcome Back</Text><Text style={styles.welcomeSub}>Access your digital collection.</Text>
          <View style={styles.roleTabs}>
            <Pressable onPress={() => { setRole('trainer'); setError(''); }} style={[styles.roleTab, role === 'trainer' && styles.roleTabActive]}><Text style={styles.roleText}>Trainer</Text></Pressable>
            <Pressable onPress={() => { setRole('officer'); setError(''); }} style={[styles.roleTab, role === 'officer' && styles.roleTabActive]}><Text style={styles.roleText}>Store Officer</Text></Pressable>
          </View>

          <View style={styles.loginCard}>
            <View style={styles.passport}><View style={styles.avatar}><Image source={require('@/assets/images/bulbasaur_by_mutationfoxy_ddim750-fullview 1 (1).png')} style={styles.avatarImage} contentFit="cover" /></View><View><Text style={styles.passportTitle}>{role === 'trainer' ? 'Trainer Passport' : 'Officer Badge'}</Text><Text style={styles.passportId}>ID: {email.trim() || 'Unknown'}</Text></View></View>
            <View style={styles.rule} />
            <Text style={styles.fieldLabel}>EMAIL OR TRAINER ID</Text><TextInput accessibilityLabel="Email or Trainer ID" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.loginInput} placeholder="ash@pallet.town" placeholderTextColor="#7B8395" />
            <Text style={styles.fieldLabel}>PASSWORD</Text><TextInput accessibilityLabel="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.loginInput} placeholder="••••••••" placeholderTextColor="#7B8395" />
            <View style={styles.rememberRow}><Pressable onPress={() => setRemember((value) => !value)} style={[styles.checkbox, remember && styles.checkboxChecked]}>{remember ? <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" /> : null}</Pressable><Text style={styles.rememberText}>Remember Me</Text><Text style={styles.forgot}>Forgot?</Text></View>
            {error ? <View style={styles.errorBox}><MaterialCommunityIcons name="alert-circle-outline" size={18} color={AppColors.secondary} /><Text style={styles.errorText}>{error}</Text></View> : null}
            <Pressable disabled={loading} onPress={() => void handleLogin()} style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}>{loading ? <ActivityIndicator color={AppColors.primary} /> : <Text style={styles.loginButtonText}>Login to Vault</Text>}</Pressable>
            <Text style={styles.connectText}>Or connect with</Text><View style={styles.socialRow}><View style={styles.social}><Text style={styles.socialText}>G</Text></View><View style={styles.social}><Text style={styles.socialText}>A</Text></View></View>
            {role === 'officer' ? <Pressable onPress={() => setPreview(true)}><Text style={styles.previewLink}>Preview Store Officer dashboard</Text></Pressable> : null}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function MetricCard({ label, value, note, icon, tint, danger = false }: { label: string; value: string; note: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; tint: string; danger?: boolean }) {
  return <View style={[styles.metricCard, danger && styles.metricDanger]}><View style={styles.metricTop}><View><Text style={[styles.metricLabel, danger && styles.dangerText]}>{label}</Text><Text style={[styles.metricValue, danger && styles.dangerText]}>{value}</Text></View><View style={[styles.metricIcon, { backgroundColor: tint }]}><MaterialCommunityIcons name={icon} size={21} color={danger ? AppColors.secondary : AppColors.primary} /></View></View><Text style={[styles.metricNote, danger && styles.metricDangerNote]} numberOfLines={2}>{note}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },
  loginContent: { alignItems: 'center', padding: 24, paddingBottom: 50 },
  welcome: { color: AppColors.text, fontFamily: AppFonts.display, fontSize: 48, letterSpacing: -1.5, marginTop: 30, textAlign: 'center' },
  welcomeSub: { color: AppColors.mutedText, fontFamily: AppFonts.bodyMedium, fontSize: 20, marginTop: 8, textAlign: 'center' },
  roleTabs: { borderBottomColor: '#DDE2F3', borderBottomWidth: 2, flexDirection: 'row', marginTop: 56, maxWidth: 620, width: '100%' },
  roleTab: { alignItems: 'center', flex: 1, padding: 18 },
  roleTabActive: { borderBottomColor: AppColors.yellow, borderBottomWidth: 4 },
  roleText: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 20 },
  loginCard: { backgroundColor: '#FFFFFF', borderRadius: 42, marginTop: 36, maxWidth: 570, padding: 40, shadowColor: '#24325A', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.11, shadowRadius: 28, width: '100%' },
  passport: { alignItems: 'center', flexDirection: 'row', gap: 18 },
  avatar: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderColor: AppColors.yellow, borderRadius: 38, borderWidth: 3, height: 76, justifyContent: 'center', overflow: 'hidden', width: 76 },
  avatarImage: { width: 76, height: 76 },
  passportTitle: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 23 },
  passportId: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 16, marginTop: 4 },
  rule: { backgroundColor: '#E3E8F9', height: 1, marginVertical: 28 },
  fieldLabel: { color: AppColors.mutedText, fontFamily: AppFonts.bodyExtraBold, fontSize: 10, letterSpacing: 1, marginBottom: 8, marginTop: 12 },
  loginInput: { borderColor: '#60697A', borderWidth: 1.5, color: AppColors.text, fontFamily: AppFonts.bodyMedium, fontSize: 16, minHeight: 58, paddingHorizontal: 17 },
  rememberRow: { alignItems: 'center', flexDirection: 'row', marginTop: 24 },
  checkbox: { alignItems: 'center', borderColor: '#D4DAEB', borderRadius: 7, borderWidth: 2, height: 28, justifyContent: 'center', width: 28 },
  checkboxChecked: { backgroundColor: AppColors.accent, borderColor: AppColors.accent },
  rememberText: { color: AppColors.text, flex: 1, fontFamily: AppFonts.body, fontSize: 16, marginLeft: 12 },
  forgot: { color: AppColors.accent, fontFamily: AppFonts.bodyMedium, fontSize: 16 },
  errorBox: { alignItems: 'center', backgroundColor: '#FFF0F1', borderRadius: 14, flexDirection: 'row', gap: 8, marginTop: 18, padding: 12 },
  errorText: { color: AppColors.secondary, flex: 1, fontFamily: AppFonts.bodyMedium, fontSize: 12 },
  loginButton: { alignItems: 'center', backgroundColor: AppColors.yellow, borderRadius: 999, justifyContent: 'center', marginTop: 28, minHeight: 62, shadowColor: AppColors.yellow, shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.3, shadowRadius: 15 },
  loginButtonText: { color: AppColors.primary, fontFamily: AppFonts.bodyExtraBold, fontSize: 20 },
  connectText: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 16, marginTop: 38, textAlign: 'center' },
  socialRow: { flexDirection: 'row', gap: 22, justifyContent: 'center', marginTop: 20 },
  social: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 32, height: 64, justifyContent: 'center', shadowColor: '#24325A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, width: 64 },
  socialText: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 28 },
  previewLink: { color: AppColors.accent, fontFamily: AppFonts.bodyBold, fontSize: 12, marginTop: 28, textAlign: 'center' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  dashboardContent: { alignSelf: 'center', maxWidth: 1080, padding: 22, paddingBottom: 60, width: '100%' },
  dashboardHeading: { alignItems: 'flex-start', flexDirection: 'row', gap: 16, justifyContent: 'space-between' },
  dashboardTitle: { color: AppColors.accent, fontFamily: AppFonts.displayBold, fontSize: 31 },
  dashboardSubtitle: { color: AppColors.text, fontFamily: AppFonts.body, fontSize: 14, lineHeight: 22, marginTop: 4 },
  logout: { color: AppColors.secondary, fontFamily: AppFonts.bodyBold, fontSize: 12, padding: 10 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 28 },
  metricCard: { backgroundColor: '#FFFFFF', borderColor: '#DDE2F3', borderRadius: 28, borderWidth: 1, flex: 1, minWidth: 230, padding: 20 },
  metricDanger: { backgroundColor: '#FFF4F5', borderColor: '#F3C5C8' },
  metricTop: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  metricLabel: { color: AppColors.mutedText, fontFamily: AppFonts.bodyExtraBold, fontSize: 9, letterSpacing: 1 },
  metricValue: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 26, marginTop: 5 },
  metricIcon: { alignItems: 'center', borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
  metricNote: { color: AppColors.accent, fontFamily: AppFonts.bodyMedium, fontSize: 11, marginTop: 18 },
  dangerText: { color: AppColors.secondary },
  metricDangerNote: { color: AppColors.mutedText },
  managerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginTop: 34 },
  panel: { backgroundColor: '#FFFFFF', borderRadius: 28, flex: 2, minWidth: 300, padding: 20, shadowColor: '#24325A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 18 },
  panelTitle: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 17 },
  tableHeader: { borderBottomColor: '#DDE2F3', borderBottomWidth: 1, flexDirection: 'row', gap: 10, marginTop: 20, paddingBottom: 8 },
  tableLabel: { color: AppColors.mutedText, flex: 1, fontFamily: AppFonts.bodyExtraBold, fontSize: 8, letterSpacing: 0.8 },
  stockRow: { alignItems: 'center', borderBottomColor: '#EDF0F8', borderBottomWidth: 1, flexDirection: 'row', gap: 10, minHeight: 58 },
  stockIcon: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 16, height: 32, justifyContent: 'center', width: 32 },
  stockName: { color: AppColors.text, flex: 1.2, fontFamily: AppFonts.bodyBold, fontSize: 12 },
  stockSet: { color: AppColors.mutedText, flex: 1, fontFamily: AppFonts.body, fontSize: 11 },
  stockCount: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 18, minWidth: 36, padding: 8 },
  stockCountText: { color: AppColors.accent, fontFamily: AppFonts.bodyBold, fontSize: 11 },
  addPanel: { backgroundColor: '#F4F5FF', borderColor: '#CACEFF', borderRadius: 28, borderWidth: 1, flex: 1, minWidth: 280, padding: 20 },
  addTitle: { color: AppColors.accent, fontFamily: AppFonts.bodyBold, fontSize: 17 },
  fieldRow: { flexDirection: 'row', gap: 10 },
  fieldHalf: { flex: 1 },
  input: { backgroundColor: '#FFFFFF', borderColor: '#D4DAEB', borderRadius: 13, borderWidth: 1, color: AppColors.text, fontFamily: AppFonts.body, fontSize: 12, marginBottom: 16, minHeight: 44, paddingHorizontal: 12 },
  orderHeading: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 18, marginBottom: 14, marginTop: 36 },
  orderCard: { alignItems: 'flex-start', backgroundColor: '#FFFFFF', borderColor: '#DDE2F3', borderRadius: 27, borderWidth: 1, flexDirection: 'row', gap: 12, marginBottom: 14, padding: 16 },
  orderIcon: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  orderCopy: { flex: 1 },
  orderTitle: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 14 },
  orderNote: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 11, marginTop: 2 },
  orderStatus: { alignItems: 'center', backgroundColor: AppColors.backgroundAlt, borderRadius: 999, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 12, paddingVertical: 8 },
  orderStatusText: { color: AppColors.text, fontFamily: AppFonts.bodyMedium, fontSize: 10 },
  eye: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
});
