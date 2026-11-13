import { Tabs } from 'expo-router/tabs';
import type { ColorValue } from 'react-native';
import { useTranslation } from '@/shared/lib';
import { Icon, useTheme, type IconName } from '@/shared/ui';
import { useTransitions } from './transitions';

function tabIcon(name: IconName) {
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Icon name={name} color={color} strong={focused} />;
  }
  return TabIcon;
}

/** Las tres pestañas de la app (HU-1.4). Atrás desde otra pestaña vuelve a Descubrir. */
export function TabsLayout() {
  const { colors, type } = useTheme();
  const transitions = useTransitions();
  const { t } = useTranslation();
  return (
    <Tabs
      backBehavior="initialRoute"
      screenOptions={{
        ...transitions.tabs,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: type.caption.fontFamily, fontSize: type.caption.fontSize },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.tabs.discover'),
          headerShown: false,
          tabBarIcon: tabIcon('compass'),
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{ title: t('nav.tabs.stories'), tabBarIcon: tabIcon('book') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: t('nav.tabs.profile'), tabBarIcon: tabIcon('user') }}
      />
    </Tabs>
  );
}
