import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, type ViewStyle } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { AppColors, AppFonts } from '@/constants/Colors';
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const tabBarStyle: ViewStyle = {
  backgroundColor: '#FFFFFF',
  borderColor: '#DDE2F3',
  borderTopWidth: 1,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  height: 74,
  paddingBottom: 10,
  paddingHorizontal: 8,
  paddingTop: 6,
  shadowColor: '#24325A',
  shadowOffset: { width: 0, height: -8 },
  shadowOpacity: 0.14,
  shadowRadius: 22,
  elevation: 14,
  zIndex: 50,
  ...(Platform.OS === 'web'
    ? {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      }
    : null),
};

function TabIcon({ icon, color }: { icon: IconName; color: string }) {
  return <MaterialCommunityIcons name={icon} color={color} size={21} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: '#8A8F9D',
        tabBarLabelPosition: 'below-icon',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: AppFonts.bodyBold,
          fontSize: 10,
          letterSpacing: 0,
          lineHeight: 12,
          marginTop: 1,
          textAlign: 'center',
        },
        tabBarStyle,
        tabBarActiveBackgroundColor: '#FFF4BA',
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 4,
          marginVertical: 0,
          paddingVertical: 3,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 56,
        },
        tabBarIconStyle: {
          marginBottom: 0,
          marginTop: 0,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <TabIcon icon="pokeball" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chase-list"
        options={{
          title: 'Chase List',
          tabBarIcon: ({ color }) => <TabIcon icon="star-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon icon="account-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
