import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { AppColors, AppFonts } from '@/constants/Colors';
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function TabIcon({ icon, color }: { icon: IconName; color: string }) {
  return <MaterialCommunityIcons name={icon} color={color} size={23} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#3D321C',
        tabBarLabelStyle: {
          fontFamily: AppFonts.bodyBold,
          fontSize: 11,
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          height: 88,
          paddingBottom: 13,
          paddingTop: 9,
          shadowColor: '#24325A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 18,
        },
        tabBarActiveBackgroundColor: AppColors.red,
        tabBarItemStyle: { borderRadius: 28, marginHorizontal: 5 },
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
        name="projects"
        options={{
          title: 'Chase List',
          tabBarIcon: ({ color }) => <TabIcon icon="star-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <TabIcon icon="shopping-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon icon="account-outline" color={color} />,
        }}
      />
      <Tabs.Screen name="add" options={{ href: null }} />
      <Tabs.Screen name="export" options={{ href: null }} />
    </Tabs>
  );
}
