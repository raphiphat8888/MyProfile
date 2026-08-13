import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { PatternBackground } from '@/components/common/PatternBackground';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ContactCard } from '@/components/profile/ContactCard';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { SkillCard } from '@/components/profile/SkillCard';
import { AppColors, AppFonts, AppSpacing } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';

export default function ProfileScreen() {
  const auth = useAuth();
  const router = useRouter();
  const { error, loading, profile, refresh, source } = useProfile();
  const links = [profile.email, profile.facebook, profile.phone];

  return (
    <SafeAreaView style={styles.screen}>
      <PatternBackground />
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Profile" searchPlaceholder="Search profile..." actionLabel="Cart" actionHref="/cart" />
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader />

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <MaterialCommunityIcons name={auth.user ? 'account-check-outline' : 'account-lock-outline'} size={24} color={AppColors.primary} />
          </View>
          <View style={styles.statusCopy}>
            <Text style={styles.statusTitle}>{auth.user ? `Logged in as ${auth.user.name}` : 'User account not connected'}</Text>
            <Text style={styles.statusText}>
              {auth.user ? `${auth.user.email} · ${auth.user.role}` : 'Login before checkout so orders can be attached to your account.'}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              if (auth.user) {
                auth.logout();
                return;
              }
              router.push('/login');
            }}
            style={({ pressed }) => [styles.accountButton, pressed && styles.pressed]}>
            <Text style={styles.accountButtonText}>{auth.user ? 'Log out' : 'Login'}</Text>
          </Pressable>
        </View>

        <SectionTitle
          eyebrow="Shop profile"
          title="Pokemon Takt Shop"
          description={`Profile data is loaded from ${source === 'cloud' ? 'Cloud MySQL' : 'local fallback'} for the storefront.`}
        />

        {error ? (
          <Card style={styles.notice}>
            <MaterialCommunityIcons name="alert-circle-outline" size={20} color={AppColors.secondary} />
            <Text style={styles.noticeText}>{error}</Text>
            <Pressable onPress={() => void refresh()} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </Card>
        ) : null}

        <View style={styles.infoGrid}>
          <Card style={styles.summaryCard}>
            <Text style={styles.cardEyebrow}>{loading ? 'Loading' : profile.location}</Text>
            <Text style={styles.summaryTitle}>{profile.summary}</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.cardEyebrow}>Inventory</Text>
            <Text style={styles.summaryTitle}>
              {profile.settings.currency} pricing · Low stock under {profile.settings.lowStockThreshold}
            </Text>
          </Card>
        </View>

        <View style={styles.contactGrid}>
          {links.map((link) => (
            <ContactCard key={link.label} item={link} />
          ))}
        </View>

        <View style={styles.skillsGrid}>
          {profile.skills.map((group) => (
            <SkillCard key={group.title} group={group} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  accountButton: {
    alignItems: 'center',
    backgroundColor: AppColors.yellow,
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 18,
  },
  accountButtonText: {
    color: AppColors.primary,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 13,
  },
  cardEyebrow: {
    color: AppColors.primary,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 18,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 1080,
    padding: AppSpacing.pageX,
    paddingBottom: 110,
    width: '100%',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 18,
  },
  notice: {
    alignItems: 'center',
    backgroundColor: '#FFF0F1',
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  noticeText: {
    color: AppColors.text,
    flex: 1,
    fontFamily: AppFonts.bodyBold,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  retryButton: {
    borderColor: AppColors.secondary,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  retryText: {
    color: AppColors.secondary,
    fontFamily: AppFonts.bodyBold,
    fontSize: 12,
  },
  screen: {
    backgroundColor: AppColors.background,
    flex: 1,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 18,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE2F3',
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 18,
    padding: 16,
  },
  statusCopy: {
    flex: 1,
    minWidth: 220,
  },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: AppColors.softBlue,
    borderRadius: 20,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  statusText: {
    color: AppColors.mutedText,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  statusTitle: {
    color: AppColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 17,
  },
  summaryCard: {
    flex: 1,
    minWidth: 260,
  },
  summaryTitle: {
    color: AppColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 20,
    lineHeight: 27,
    marginTop: 8,
  },
});
