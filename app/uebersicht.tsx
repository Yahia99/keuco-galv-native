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
  const controller = new AbortController();
  // Getting printers names from the print server ==> (GET Request)
  const getDrucker = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users",
        {
          signal: controller.signal,
        }
      );
      setData(response.data);
      setIsModalVisible(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.alert("Fehler!", err.message);
    }
    // Cleaner Function
    return () => {
      controller.abort();
    };
  };

  const valuesArr: any = [];
  const values = useLocalSearchParams();
  let key = 0;
  for (const value in values) {
    valuesArr.push(
      <View style={styles.textContainer} key={key}>
        <Text style={styles.text}>{value.toUpperCase()}</Text>
        <Text style={[styles.text]}>{values[value]}</Text>
      </View>
    );
    key++;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainTextContainer}>{valuesArr}</View>
      <View style={{ gap: 10 }}>
        <Text
          style={styles.button}
          selectable={false}
          onPress={() => {
            getDrucker();
          }}
          disabled={isLoading}
        >
          {/* 
          Showing Loader if the request still loading
        */}
          {isLoading ? <ActivityIndicator size={28} /> : "Drucker auswählen"}
        </Text>
        {/*
          Alerting user by canceling
        */}
        <Pressable
          onPress={() =>
            Alert.alert(
              "Warnung!",
              "Beim Verlassen der Seite werden alle Daten zurückgesetzt",
              [
                { text: "Abbrechen", onPress: () => "", style: "cancel" },
                { text: "Ok", onPress: () => router.back() },
              ]
            )
          }
          disabled={isLoading}
        >
          <Text style={styles.button} selectable={false}>
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
  mainTextContainer: {
    flex: 0.8,
    width: "100%",
    padding: 20,
    gap: 30,
    borderRadius: 10,
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  text: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlignVertical: "center",
  },
  button: {
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
