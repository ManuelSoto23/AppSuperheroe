import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { RootStackParamList, MainTabParamList } from "../types";
import { SuperheroesScreen } from "../screens/SuperheroesScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { TeamsScreen } from "../screens/TeamsScreen";
import { SuperheroDetailScreen } from "../screens/SuperheroDetailScreen";
import { SearchSuperheroScreen } from "../screens/SearchSuperheroScreen";
import { AddMemberScreen } from "../screens/AddMemberScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Superheroes") {
            iconName = focused ? "shield" : "shield-outline";
          } else if (route.name === "Favorites") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Teams") {
            iconName = focused ? "people" : "people-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.navActive,
        tabBarInactiveTintColor: colors.navInactive,
        tabBarStyle: {
          backgroundColor: colors.navBackground,
          borderTopColor: colors.navBorder,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen name="Superheroes" component={SuperheroesScreen} />
      <Tab.Screen name="Teams" component={TeamsScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuperheroDetail"
          component={SuperheroDetailScreen}
          options={{ title: "Superhero Details" }}
        />
        <Stack.Screen
          name="SearchSuperhero"
          component={SearchSuperheroScreen}
          options={{ title: "Search Superhero" }}
        />
        <Stack.Screen
          name="AddMember"
          component={AddMemberScreen}
          options={{ title: "Add Member" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
