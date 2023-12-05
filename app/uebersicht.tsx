import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, router } from "expo-router";
import Drucker from "../components/Drucker";

export default function Uebersicht() {
  // States
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<[]>([]);
  // Getting params from previous page
  const { rmNr, teileNr, menge, tr, anzScans } = useLocalSearchParams();
  const controller = new AbortController();
  // Getting printers names from the print server ==> (GET Request)
  const getDrucker = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://galv.keuco.local", {
        signal: controller.signal,
      });
      setData(response.data);
      setIsModalVisible(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.alert("Fehler", err.message);
    }
    // Cleaner Function
    return () => {
      controller.abort();
    };
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text>RmNr: {rmNr}</Text>
        <Text>TeileNr: {teileNr} </Text>
        <Text>Menge: {menge}</Text>
        <Text>T/R: {anzScans ? (+anzScans === 0 ? "" : tr) : ""}</Text>
        <Text>Anzahl Scans: {anzScans}</Text>
      </View>
      <View style={{ gap: 10 }}>
        <Pressable
          onPress={() => {
            getDrucker();
          }}
          disabled={isLoading ? true : false}
        >
          {/* 
            Showing Loader if the request still processing
          */}
          <Text style={styles.text} selectable={false}>
            {isLoading ? <ActivityIndicator size={28} /> : "Drucker auswählen"}
          </Text>
        </Pressable>
        {/* 
          Alerting user by canceling
        */}
        <Pressable
          onPress={() =>
            Alert.alert(
              "Warnung!",
              "Beim Verlassen der Seite wird alles zurückgesetzt",
              [
                { text: "Abbrechen", onPress: () => "", style: "cancel" },
                { text: "Ok", onPress: () => router.back() },
              ]
            )
          }
        >
          <Text style={styles.text} selectable={false}>
            Abbrechen
          </Text>
        </Pressable>
      </View>
      {/* 
        Showing modal after the request is successfully done
      */}
      {isModalVisible ? (
        <Drucker
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          data={data}
          params={useLocalSearchParams}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textContainer: {
    width: "100%",
    flex: 0.8,
    padding: 20,
    gap: 30,
    borderRadius: 10,
    borderWidth: 1,
  },
  text: {
    width: "100%",
    padding: 25,
    fontSize: 20,
    color: "#fff",
    backgroundColor: "steelblue",
    borderRadius: 10,
    textAlign: "center",
    shadowColor: "#000",
    elevation: 5,
  },
});
