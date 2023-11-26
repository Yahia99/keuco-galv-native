import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Drucker from "../components/Drucker";

export default function Uebersicht() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const { rmNr, teileNr, menge, tr, scan } = useLocalSearchParams();
  const getDrucker = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/1"
      );
      const json: {}[] = await response.json();
      setData(json);
      setIsModalVisible(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      alert("Request Failed");
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text>RmNr: {rmNr}</Text>
        <Text>TeileNr: {teileNr} </Text>
        <Text>Menge: {menge}</Text>
        <Text>T/R: {scan ? (+scan === 0 ? "" : tr) : ""}</Text>
        <Text>Anzahl Scans: {scan}</Text>
      </View>
      <View style={{ gap: 10 }}>
        <Pressable onPress={() => getDrucker()}>
          {isLoading ? (
            <Text style={styles.link}>
              <ActivityIndicator size={28} />
            </Text>
          ) : (
            <Text style={styles.link}>Drucker Auswählen</Text>
          )}
        </Pressable>
        <Pressable
          onPress={() =>
            Alert.alert(
              "Achtung!",
              "Beim Verlassen der Seite wird alles zurückgesetzt",
              [
                { text: "Abbrechen", onPress: () => "", style: "cancel" },
                { text: "Ok", onPress: () => router.back() },
              ]
            )
          }
        >
          <Text style={styles.link}>Abbrechen</Text>
        </Pressable>
      </View>
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
  link: {
    width: "100%",
    padding: 25,
    fontSize: 20,
    color: "#fff",
    backgroundColor: "steelblue",
    borderRadius: 10,
    textAlign: "center",
  },
});
