import React from "react";
import { StatusBar } from "expo-status-bar";
import { SuperheroesScreen } from "./src/screens/SuperheroesScreen";
import { AppProvider } from "./src/context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <SuperheroesScreen />
    </AppProvider>
  );
}
