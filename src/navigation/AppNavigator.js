/**
 * AppNavigator Component
 * Main navigation structure using React Navigation
 * Includes authentication flow and protected routes
 */

import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";

const linking = {
  prefixes: [Linking.createURL("/"), "flashcardmobile://", "https://flashcardmobile.app"],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Home: {
            screens: {
              HomeMain: "home",
              FlashcardDetail: "list/:listId",
              Study: "study/:listId",
              Quiz: "quiz/:listId",
              Streak: "streak",
              HardWords: "hard",
            },
          },
          MyLists: {
            screens: {
              MyListsMain: "mylists",
              CreateList: "create",
            },
          },
          Favorites: { screens: { FavoritesMain: "favorites" } },
          Profile: { screens: { ProfileMain: "profile" } },
        },
      },
      Auth: {
        screens: {
          Login: "login",
          Register: "register",
          ForgotPassword: "forgot-password",
        },
      },
    },
  },
};
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Auth Context
import { AuthProvider, useAuth } from "../contexts/AuthContext";

// Import Screens
import HomeScreen from "../screens/home/HomeScreen";
import MyListsScreen from "../screens/mylists/MyListsScreen";
import CreateListScreen from "../screens/mylists/CreateListScreen";
import FavoritesScreen from "../screens/favorites/FavoritesScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import FlashcardDetailScreen from "../screens/flashcard/FlashcardDetailScreen";
import StudyScreen from "../screens/study/StudyScreen";
import QuizScreen from "../screens/study/QuizScreen";
import StreakScreen from "../screens/streak/StreakScreen";
import HardWordsScreen from "../screens/hard/HardWordsScreen";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

// Legal Screens
import PrivacyPolicyScreen from "../screens/legal/PrivacyPolicyScreen";
import TermsOfServiceScreen from "../screens/legal/TermsOfServiceScreen";
import PrivacySettingsScreen from "../screens/legal/PrivacySettingsScreen";

// Settings
import AppearanceScreen from "../screens/settings/AppearanceScreen";

// Onboarding
import OnboardingScreen, { hasSeenOnboarding } from "../screens/onboarding/OnboardingScreen";

// Theme
import T from "../themes/tokens";
import TabBar from "../components/design/TabBar";

// Navigation Stacks
const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const MyListsStack = createNativeStackNavigator();
const FavoritesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Loading Screen Component
function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: T.bg,
      }}
    >
      <ActivityIndicator size="large" color={T.lime} />
      <Text style={{ marginTop: 16, fontSize: 16, color: T.textSec, fontFamily: T.fontBody }}>
        Yükleniyor...
      </Text>
    </View>
  );
}

// Auth Stack Navigator
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

// Home Stack (nested stack for Home tab)
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="FlashcardDetail"
        component={FlashcardDetailScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <HomeStack.Screen
        name="Study"
        component={StudyScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <HomeStack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <HomeStack.Screen
        name="Streak"
        component={StreakScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <HomeStack.Screen
        name="HardWords"
        component={HardWordsScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
    </HomeStack.Navigator>
  );
}

// My Lists Stack
function MyListsStackNavigator() {
  return (
    <MyListsStack.Navigator screenOptions={{ headerShown: false }}>
      <MyListsStack.Screen name="MyListsMain" component={MyListsScreen} />
      <MyListsStack.Screen
        name="CreateList"
        component={CreateListScreen}
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
        }}
      />
      <MyListsStack.Screen
        name="FlashcardDetail"
        component={FlashcardDetailScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <MyListsStack.Screen
        name="Study"
        component={StudyScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <MyListsStack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
    </MyListsStack.Navigator>
  );
}

// Favorites Stack
function FavoritesStackNavigator() {
  return (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritesStack.Screen name="FavoritesMain" component={FavoritesScreen} />
      <FavoritesStack.Screen
        name="FlashcardDetail"
        component={FlashcardDetailScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <FavoritesStack.Screen
        name="Study"
        component={StudyScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <FavoritesStack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
    </FavoritesStack.Navigator>
  );
}

// Profile Stack
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen
        name="Appearance"
        component={AppearanceScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <ProfileStack.Screen
        name="PrivacySettings"
        component={PrivacySettingsScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <ProfileStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <ProfileStack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
    </ProfileStack.Navigator>
  );
}

// Bottom Tab Navigator — Design v2 sırası: Ana Sayfa, Çalış, Kütüphane, Profil.
// Route isimleri (Home/Favorites/MyLists/Profile) backward-compat için aynı kalır.
function BottomTabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: "Ana Sayfa",
          tabBarAccessibilityLabel: "Ana Sayfa sekmesi",
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStackNavigator}
        options={{
          tabBarLabel: "Çalış",
          tabBarAccessibilityLabel: "Çalış sekmesi",
        }}
      />
      <Tab.Screen
        name="MyLists"
        component={MyListsStackNavigator}
        options={{
          tabBarLabel: "Kütüphane",
          tabBarAccessibilityLabel: "Kütüphane sekmesi",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "Profil",
          tabBarAccessibilityLabel: "Profil sekmesi",
        }}
      />
    </Tab.Navigator>
  );
}

// Root Navigator with Auth Logic + Onboarding
function RootNavigator() {
  const { isAuthenticated, loading, initializing } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    hasSeenOnboarding().then((seen) => setShowOnboarding(!seen));
  }, []);

  // Show loading screen while initializing
  if (initializing || loading || showOnboarding === null) {
    return <LoadingScreen />;
  }

  // First-time user — show onboarding
  if (showOnboarding) {
    return <OnboardingScreen onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      {isAuthenticated() ? (
        <RootStack.Screen name="MainTabs" component={BottomTabNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </RootStack.Navigator>
  );
}

// Main App Navigator with Auth Provider
const AppNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer linking={linking} fallback={<LoadingScreen />}>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default AppNavigator;
