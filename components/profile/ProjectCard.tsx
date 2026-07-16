import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { AppColors, AppRadius } from '@/constants/Colors';
import type { Project } from '@/types/profile';
import { openLink } from '@/utils/openLink';

type ProjectCardProps = {
  project: Project;
};

function ProductImageFlip({
  hovered,
  project,
}: {
  hovered: boolean;
  project: Project;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const flip = useRef(new Animated.Value(0)).current;
  const showImage = project.imageUrl && !imageFailed;

  useEffect(() => {
    Animated.timing(flip, {
      duration: 620,
      easing: Easing.inOut(Easing.cubic),
      toValue: hovered ? 180 : 0,
      useNativeDriver: true,
    }).start();
  }, [flip, hovered]);

  const frontRotation = flip.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backRotation = flip.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flip.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flip.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <View style={styles.imageFrame}>
      <Animated.View
        style={[
          styles.face,
          styles.frontFace,
          {
            opacity: frontOpacity,
            transform: [{ perspective: 900 }, { rotateY: frontRotation }],
          },
        ]}>
        {showImage ? (
          <Image
            source={{ uri: project.imageUrl }}
            style={styles.image}
            contentFit="contain"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.fallbackBadge}>{project.category}</Text>
            <Text style={styles.fallbackText}>{project.title.slice(0, 1)}</Text>
            <Text style={styles.fallbackName}>{project.title}</Text>
          </View>
        )}
      </Animated.View>

      <Animated.View
        style={[
          styles.face,
          styles.backFace,
          {
            opacity: backOpacity,
            transform: [{ perspective: 900 }, { rotateY: backRotation }],
          },
        ]}>
        <View style={styles.blurOrbLarge} />
        <View style={styles.blurOrbSmall} />
        <View style={styles.glassPanel} />
        <Text style={styles.backBadge}>Card Back</Text>
        <Text style={styles.backTitle}>{project.title}</Text>
        <Text style={styles.backMeta}>{project.category}</Text>
        <View style={styles.backDivider} />
        <Text style={styles.backPrice}>{project.price}</Text>
        <Text style={styles.backStock}>Stock {project.stock}</Text>
      </Animated.View>
    </View>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const content = (
    <Pressable
      onPress={project.href ? () => openLink(project.href!) : undefined}
      style={styles.pressableCard}>
      {({ hovered }) => (
        <Card style={styles.card}>
          <ProductImageFlip hovered={hovered} project={project} />
          <View style={styles.heading}>
            <Text style={styles.title}>{project.title}</Text>
            {project.status ? <Text style={styles.status}>{project.status}</Text> : null}
          </View>
          <Text style={styles.description}>{project.description}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.price}>{project.price}</Text>
            <Text style={styles.stock}>Stock {project.stock}</Text>
          </View>
          <View style={styles.stack}>
            {project.techStack.map((tech) => (
              <Text key={tech} style={styles.tech}>
                {tech}
              </Text>
            ))}
          </View>
        </Card>
      )}
    </Pressable>
  );

  return content;
}

const styles = StyleSheet.create({
  pressableCard: {
    flex: 1,
    minWidth: 280,
  },
  card: {
    flex: 1,
  },
  imageFrame: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: AppRadius.control,
    borderColor: AppColors.border,
    borderWidth: 1,
    height: 210,
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  face: {
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: AppRadius.control,
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  frontFace: {
    backgroundColor: '#F8F9FA',
  },
  backFace: {
    backgroundColor: '#1849B8',
    padding: 18,
  },
  blurOrbLarge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 120,
    height: 190,
    left: -58,
    opacity: 0.9,
    position: 'absolute',
    top: -60,
    width: 190,
  },
  blurOrbSmall: {
    backgroundColor: 'rgba(36, 207, 255, 0.20)',
    borderRadius: 90,
    bottom: -45,
    height: 150,
    opacity: 0.9,
    position: 'absolute',
    right: -36,
    width: 150,
  },
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: AppRadius.control,
    borderWidth: 1,
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  image: {
    height: 188,
    width: 132,
  },
  imageFallback: {
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.control,
    height: '100%',
    justifyContent: 'center',
    padding: 16,
    width: '100%',
  },
  fallbackBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: AppRadius.pill,
    color: AppColors.primary,
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  fallbackText: {
    color: '#FFFFFF',
    fontSize: 54,
    fontWeight: '900',
    marginTop: 14,
  },
  fallbackName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10,
    textAlign: 'center',
  },
  backBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: AppRadius.pill,
    color: AppColors.primary,
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 18,
    textAlign: 'center',
  },
  backMeta: {
    color: '#DCE8FF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8,
  },
  backDivider: {
    backgroundColor: '#F5C518',
    height: 1,
    marginVertical: 16,
    width: '72%',
  },
  backPrice: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  backStock: {
    color: '#DCE8FF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
  heading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  title: {
    color: AppColors.text,
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    minWidth: 180,
  },
  status: {
    backgroundColor: AppColors.softMint,
    borderRadius: AppRadius.pill,
    color: AppColors.accent,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  description: {
    color: AppColors.mutedText,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 14,
  },
  price: {
    color: AppColors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  stock: {
    color: AppColors.mutedText,
    fontSize: 13,
    fontWeight: '800',
  },
  stack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  tech: {
    backgroundColor: AppColors.softPurple,
    borderRadius: AppRadius.pill,
    color: AppColors.secondary,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
