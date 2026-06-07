/**
 * AppNavigator Component
 * Main navigation structure using React Navigation
 * Includes authentication flow and protected routes
 */

import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import * as Linking from "expo-linking";

// İçerik ekranlarında tab bar'ı gizle — alttaki içerik kesilmesin.
const HIDE_TAB_BAR_ON = new Set([
  "Study",
  "Quiz",
  "Streak",
  "Roadmap",
  "FlashcardDetail",
  "HardWords",
  "CreateList",
  "FavoriteWords",
  "ListExplorer",
  "EditProfile",
  "Language",
  "Settings",
  "Appearance",
  "PrivacySettings",
  "PrivacyPolicy",
  "TermsOfService",
]);

function getTabBarStyle(route) {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (routeName && HIDE_TAB_BAR_ON.has(routeName)) {
    return { display: "none" };
  }
  return undefined;
}

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
          Profile: {
            screens: {
              ProfileMain: "profile",
              PublicProfile: "u/:userId",
            },
          },
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
import { PremiumProvider } from "../contexts/PremiumContext";
import { AchievementsProvider, useAchievements } from "../contexts/AchievementsContext";
import { ProfileProvider } from "../contexts/ProfileContext";
import AchievementModal from "../components/design/AchievementModal";

// Import Screens
import HomeScreen from "../screens/home/HomeScreen";
import ExamHomeScreen from "../screens/home/ExamHomeScreen";
import MyListsScreen from "../screens/mylists/MyListsScreen";
import CreateListScreen from "../screens/mylists/CreateListScreen";
import FavoritesScreen from "../screens/favorites/FavoritesScreen";
import FavoriteWordsScreen from "../screens/favorites/FavoriteWordsScreen";
import ListExplorerScreen from "../screens/explore/ListExplorerScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import PublicProfileScreen from "../screens/profile/PublicProfileScreen";
import FlashcardDetailScreen from "../screens/flashcard/FlashcardDetailScreen";
import StudyScreen from "../screens/study/StudyScreen";
import QuizScreen from "../screens/study/QuizScreen";
import LectioScreen from "../screens/study/LectioScreen";
import StreakScreen from "../screens/streak/StreakScreen";
import WeeklyRecapScreen from "../screens/recap/WeeklyRecapScreen";
import HardWordsScreen from "../screens/hard/HardWordsScreen";
import RoadmapScreen from "../screens/roadmap/RoadmapScreen";

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
import LanguageScreen from "../screens/settings/LanguageScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";

// Paywall
import PaywallScreen from "../screens/paywall/PaywallScreen";

// Achievements
import AchievementsScreen from "../screens/achievements/AchievementsScreen";

// Onboarding
import OnboardingScreen, { hasSeenOnboarding } from "../screens/onboarding/OnboardingScreen";

// Theme
import { T } from "../themes/tokens";
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
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          animation: "fade",
          animationDuration: 260,
          animationTypeForReplace: "pop",
          // Replace sonrası önceki ekran detach edilmesin → cross-fade gerçek olur
          detachPreviousScreen: false,
          // Blur'da donmasın — geri dönüşte instant göründüğü için
          freezeOnBlur: false,
        }}
      />
      <HomeStack.Screen
        name="ExamHome"
        component={ExamHomeScreen}
        options={{
          animation: "fade",
          animationDuration: 260,
          animationTypeForReplace: "pop",
          detachPreviousScreen: false,
          freezeOnBlur: false,
        }}
      />
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
        name="Lectio"
        component={LectioScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <HomeStack.Screen
        name="Streak"
        component={StreakScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <HomeStack.Screen
        name="Roadmap"
        component={RoadmapScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <HomeStack.Screen
        name="HardWords"
        component={HardWordsScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <HomeStack.Screen
        name="ListExplorer"
        component={ListExplorerScreen}
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
      <MyListsStack.Screen
        name="FavoriteWords"
        component={FavoriteWordsScreen}
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
        name="PublicProfile"
        component={PublicProfileScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <ProfileStack.Screen
        name="Streak"
        component={StreakScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <ProfileStack.Screen
        name="WeeklyRecap"
        component={WeeklyRecapScreen}
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <ProfileStack.Screen
        name="Roadmap"
        component={RoadmapScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <ProfileStack.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <ProfileStack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
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
        options={({ route }) => ({
          tabBarLabel: "Ana Sayfa",
          tabBarAccessibilityLabel: "Ana Sayfa sekmesi",
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStackNavigator}
        options={({ route }) => ({
          tabBarLabel: "Çalış",
          tabBarAccessibilityLabel: "Çalış sekmesi",
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen
        name="MyLists"
        component={MyListsStackNavigator}
        options={({ route }) => ({
          tabBarLabel: "Kütüphane",
          tabBarAccessibilityLabel: "Kütüphane sekmesi",
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={({ route }) => ({
          tabBarLabel: "Profil",
          tabBarAccessibilityLabel: "Profil sekmesi",
          tabBarStyle: getTabBarStyle(route),
        })}
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
        <>
          <RootStack.Screen name="MainTabs" component={BottomTabNavigator} />
          <RootStack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </RootStack.Navigator>
  );
}

// Global Achievement Modal — yeni rozet kazanıldığında otomatik gösterir
function GlobalAchievementBridge() {
  const { newlyUnlocked, dismissNew } = useAchievements();
  return (
    <AchievementModal
      visible={!!newlyUnlocked}
      badge={newlyUnlocked}
      onClose={dismissNew}
    />
  );
}

// Main App Navigator with all providers
const AppNavigator = () => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <PremiumProvider>
          <AchievementsProvider>
            <NavigationContainer linking={linking} fallback={<LoadingScreen />}>
              <RootNavigator />
            </NavigationContainer>
            <GlobalAchievementBridge />
          </AchievementsProvider>
        </PremiumProvider>
      </ProfileProvider>
    </AuthProvider>
  );
};

export default AppNavigator;
