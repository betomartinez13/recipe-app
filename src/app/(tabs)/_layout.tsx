import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.lightGray,
        },
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.black,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mis Recetas',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>&#x1F4D6;</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>&#x1F50D;</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Grupos',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>&#x1F4C1;</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>&#x1F464;</Text>
          ),
        }}
      />
    </Tabs>
  );
}
