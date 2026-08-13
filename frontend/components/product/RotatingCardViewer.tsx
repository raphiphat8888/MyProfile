import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { AppColors, AppFonts } from '@/constants/Colors';

type RotatingCardViewerProps = {
  frontSource: ImageSourcePropType;
  backSource: ImageSourcePropType;
  title: string;
  subtitle?: string;
  tags?: string[];
  badgeLabel?: string;
  foilBack?: boolean;
  onAddPress?: () => void;
};

const LOOP_MS = 7500;
const SHIMMER_MS = 1800;

export function RotatingCardViewer({
  frontSource,
  backSource,
  title,
  subtitle = 'Tap or drag to inspect both sides.',
  tags = ['Holo', 'Collector', '2026'],
  badgeLabel = 'Secret Rare',
  foilBack = false,
  onAddPress,
}: RotatingCardViewerProps) {
  const spin = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const dragOffset = useRef(0);
  const [autoSpin, setAutoSpin] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isDragging || !autoSpin) return;

    let frame = 0;
    const started = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const animate = () => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const elapsed = now - started;
      const progress = (elapsed % LOOP_MS) / LOOP_MS;
      spin.setValue(progress);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [autoSpin, isDragging, spin]);

  useEffect(() => {
    if (!foilBack) {
      return;
    }

    let frame = 0;
    const started = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const animate = () => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      shimmer.setValue(((now - started) % SHIMMER_MS) / SHIMMER_MS);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [foilBack, shimmer]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 3,
        onPanResponderGrant: () => {
          setIsDragging(true);
          drag.stopAnimation((value) => {
            dragOffset.current = value;
          });
        },
        onPanResponderMove: (_, gesture) => {
          drag.setValue(dragOffset.current + gesture.dx / 220);
        },
        onPanResponderRelease: (_, gesture) => {
          setIsDragging(false);
          setAutoSpin(true);
          drag.stopAnimation((value) => {
            dragOffset.current = value;
          });
          dragOffset.current = 0;
          drag.setValue(0);
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
          setAutoSpin(true);
          drag.stopAnimation((value) => {
            dragOffset.current = value;
          });
        },
      }),
    [drag],
  );

  const spinValue = isDragging ? drag : spin;
  const rotateY = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const frontOpacity = spinValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.95, 0, 0, 1],
  });

  const backOpacity = spinValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 0, 1, 0.95, 0],
  });

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 220],
  });

  const shimmerWideTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-210, 250],
  });

  const shimmerSecondaryTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [210, -250],
  });

  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 0.16, 0.48, 0.84, 1],
    outputRange: [0.32, 0.82, 0.58, 0.88, 0.32],
  });

  const shimmerSecondaryOpacity = shimmer.interpolate({
    inputRange: [0, 0.24, 0.58, 0.9, 1],
    outputRange: [0.16, 0.46, 0.72, 0.38, 0.16],
  });

  const toggleSpin = () => setAutoSpin((current) => !current);

  const animateToHalfTurn = () => {
    setAutoSpin(true);
    Animated.spring(drag, {
      toValue: 0.5,
      useNativeDriver: true,
      friction: 9,
      tension: 45,
    }).start(() => {
      drag.stopAnimation((value) => {
        dragOffset.current = value;
      });
    });
  };

  return (
    <View style={styles.wrap}>
    <View style={styles.toolbar}>
      <View style={styles.badge}>
        <MaterialCommunityIcons name="star-four-points" size={14} color={AppColors.secondary} />
        <Text style={styles.badgeText}>{badgeLabel}</Text>
      </View>
      <View style={styles.toolbarActions}>
        <Pressable onPress={toggleSpin} style={styles.actionButton}>
          <Text style={styles.actionText}>{autoSpin ? 'Pause' : 'Auto Spin'}</Text>
        </Pressable>
          <Pressable onPress={animateToHalfTurn} style={[styles.actionButton, styles.secondaryAction]}>
            <Text style={styles.secondaryText}>Flip 180°</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.stageOuter}>
        <View style={styles.stageGlow} />
        <View style={styles.stage} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.card3d,
              {
                transform: [{ perspective: 1400 }, { rotateY }],
              },
            ]}>
            <Animated.View style={[styles.face, styles.frontFace, { opacity: frontOpacity }]}>
              <View style={[styles.faceShell, foilBack && styles.frontFoilShell]}>
                <Image source={frontSource} style={styles.cardImage} contentFit="contain" />
                {foilBack ? (
                  <>
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.frontRainbowFoil,
                        {
                          transform: [
                            { translateX: shimmerTranslate },
                            { rotate: '-16deg' },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.frontGlossFoil,
                        {
                          transform: [
                            { translateX: shimmerTranslate },
                            { rotate: '-16deg' },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.continuousRainbowSweep,
                        {
                          opacity: shimmerOpacity,
                          transform: [
                            { translateX: shimmerWideTranslate },
                            { rotate: '-18deg' },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.continuousRainbowSweep,
                        styles.secondaryRainbowSweep,
                        {
                          opacity: shimmerSecondaryOpacity,
                          transform: [
                            { translateX: shimmerSecondaryTranslate },
                            { rotate: '18deg' },
                          ],
                        },
                      ]}
                    />
                  </>
                ) : null}
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.face,
                styles.backFace,
                { opacity: backOpacity, transform: [{ rotateY: '180deg' }] },
              ]}>
              <View style={[styles.faceShell, foilBack && styles.foilShell]}>
                <Image source={backSource} style={styles.cardImage} contentFit="contain" />
                {foilBack ? (
                  <>
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.rainbowShimmer,
                        {
                          transform: [
                            { translateX: shimmerTranslate },
                            { rotate: '18deg' },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.whiteShine,
                        {
                          transform: [
                            { translateX: shimmerTranslate },
                            { rotate: '18deg' },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.continuousRainbowSweep,
                        {
                          opacity: shimmerOpacity,
                          transform: [
                            { translateX: shimmerWideTranslate },
                            { rotate: '-18deg' },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.continuousRainbowSweep,
                        styles.secondaryRainbowSweep,
                        {
                          opacity: shimmerSecondaryOpacity,
                          transform: [
                            { translateX: shimmerSecondaryTranslate },
                            { rotate: '18deg' },
                          ],
                        },
                      ]}
                    />
                  </>
                ) : null}
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </View>

      <View style={styles.copyBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {onAddPress ? (
        <Pressable onPress={onAddPress} style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Add to Trainer Bag</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#EEF2FF',
    borderRadius: 36,
    padding: 18,
  },
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#FFE2E0',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    color: AppColors.secondary,
    fontFamily: AppFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  toolbarActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryAction: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9C6A0',
  },
  actionText: {
    color: '#FFFFFF',
    fontFamily: AppFonts.bodyBold,
    fontSize: 12,
  },
  secondaryText: {
    color: AppColors.text,
    fontFamily: AppFonts.bodyBold,
    fontSize: 12,
  },
  stageOuter: {
    alignItems: 'center',
    borderRadius: 30,
    height: 520,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  stageGlow: {
    backgroundColor: '#F8EED5',
    borderRadius: 220,
    height: 320,
    opacity: 0.95,
    position: 'absolute',
    right: -40,
    top: 120,
    width: 320,
  },
  stage: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  card3d: {
    height: '76%',
    maxWidth: 360,
    position: 'relative',
    width: '62%',
    // @ts-ignore web
    transformStyle: 'preserve-3d',
    // @ts-ignore web
    willChange: 'transform',
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: 'hidden',
  },
  frontFace: {
    zIndex: 2,
  },
  backFace: {
    zIndex: 1,
  },
  faceShell: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    flex: 1,
    overflow: 'hidden',
    padding: 10,
    shadowColor: '#2B2B4D',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
  },
  foilShell: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFE7D4',
    borderWidth: 1,
    shadowColor: '#EDE2C7',
    shadowOpacity: 0.36,
    shadowRadius: 28,
  },
  frontFoilShell: {
    shadowColor: '#FFCB05',
    shadowOpacity: 0.28,
    shadowRadius: 28,
  },
  cardImage: {
    height: '100%',
    width: '100%',
  },
  frontRainbowFoil: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    bottom: -60,
    left: -72,
    opacity: 0.62,
    position: 'absolute',
    top: -60,
    width: 118,
    // @ts-ignore web-only holographic surface
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,80,151,0.32) 16%, rgba(255,221,46,0.38) 32%, rgba(43,255,211,0.34) 50%, rgba(54,135,255,0.34) 68%, rgba(213,87,255,0.30) 84%, rgba(255,255,255,0) 100%)',
    // @ts-ignore web-only blend polish
    mixBlendMode: 'screen',
    // @ts-ignore web-only blur polish
    filter: 'blur(1.5px)',
  },
  frontGlossFoil: {
    backgroundColor: 'rgba(255,255,255,0.50)',
    bottom: -58,
    left: -28,
    opacity: 0.62,
    position: 'absolute',
    top: -58,
    width: 24,
    // @ts-ignore web-only blend polish
    mixBlendMode: 'screen',
    // @ts-ignore web-only gloss polish
    boxShadow: '0 0 24px rgba(255,255,255,0.72)',
  },
  rainbowShimmer: {
    backgroundColor: 'rgba(255,255,255,0.42)',
    bottom: -58,
    left: -62,
    opacity: 0.78,
    position: 'absolute',
    top: -58,
    width: 105,
    // @ts-ignore web-only foil gradient
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,56,142,0.46) 18%, rgba(255,222,61,0.62) 34%, rgba(72,255,203,0.55) 50%, rgba(66,147,255,0.56) 66%, rgba(215,90,255,0.48) 82%, rgba(255,255,255,0) 100%)',
    // @ts-ignore web-only blur polish
    filter: 'blur(2px)',
  },
  whiteShine: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    bottom: -52,
    left: -24,
    opacity: 0.7,
    position: 'absolute',
    top: -52,
    width: 22,
    // @ts-ignore web-only gloss polish
    boxShadow: '0 0 28px rgba(255,255,255,0.85)',
  },
  continuousRainbowSweep: {
    bottom: -54,
    left: -76,
    position: 'absolute',
    top: -54,
    width: 96,
    zIndex: 6,
    backgroundColor: 'rgba(255,255,255,0.46)',
    // @ts-ignore web-only holographic foil sweep
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,76,142,0.34) 16%, rgba(255,222,54,0.50) 32%, rgba(87,255,207,0.48) 50%, rgba(83,153,255,0.48) 66%, rgba(223,96,255,0.38) 82%, rgba(255,255,255,0) 100%)',
    // @ts-ignore web-only blend polish
    mixBlendMode: 'screen',
    // @ts-ignore web-only glow polish
    filter: 'blur(0.8px)',
  },
  secondaryRainbowSweep: {
    width: 74,
    zIndex: 7,
    backgroundColor: 'rgba(255,255,255,0.36)',
    // @ts-ignore web-only holographic foil sweep
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(116,255,235,0.38) 24%, rgba(255,255,255,0.64) 50%, rgba(255,86,221,0.34) 76%, rgba(255,255,255,0) 100%)',
  },
  copyBlock: {
    marginTop: 18,
  },
  title: {
    color: AppColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 28,
    letterSpacing: -0.6,
  },
  subtitle: {
    color: AppColors.mutedText,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 14,
    marginTop: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tagPill: {
    backgroundColor: '#FFF4BA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagText: {
    color: AppColors.primary,
    fontFamily: AppFonts.bodyBold,
    fontSize: 12,
  },
  buyButton: {
    alignItems: 'center',
    backgroundColor: AppColors.yellow,
    borderRadius: 999,
    marginTop: 18,
    minHeight: 48,
    justifyContent: 'center',
  },
  buyButtonText: {
    color: AppColors.primary,
    fontFamily: AppFonts.bodyBold,
    fontSize: 15,
  },
});
