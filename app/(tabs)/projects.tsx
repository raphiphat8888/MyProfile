import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import { Header } from '@/components/common/Header';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ProjectCard } from '@/components/profile/ProjectCard';
import { AppColors, AppSpacing } from '@/constants/Colors';
import { profile } from '@/constants/ProfileData';

export default function ProjectsScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header
        title="Products"
        searchPlaceholder="Search products..."
        actionLabel="+ Add Card"
        actionHref="/add"
      />
      <ScrollView style={styles.scroller} contentContainerStyle={styles.content}>
        <SectionTitle
          eyebrow="Products"
          title="Pokemon cards and sealed products"
          description="Featured items for collectors and players. Message us to confirm stock, photos, and final price."
        />

        <View style={styles.grid}>
          {profile.projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: AppColors.background,
    flex: 1,
  },
  scroller: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 1120,
    padding: AppSpacing.pageX,
    paddingBottom: AppSpacing.pageBottom,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppSpacing.cardGap,
  },
});
