import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, router } from "expo-router";
import Drucker from "../components/Drucker";
import Logo from "../components/Logo";
import { StatusBar } from "expo-status-bar";

export default function Uebersicht() {
  // States
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<[]>([]);
  // Getting printers from the print server ==> (GET Request)
  const controller = new AbortController();
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
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert("Fehler!", err.message);
    } finally {
      // Cleaner Function
      return () => {
        controller.abort();
      };
    }
  };

  const valuesArr: Array<React.JSX.Element> = [];
  const values = useLocalSearchParams();
  let key = 0;
  for (const value in values) {
    valuesArr.push(
      <View style={styles.textContainer} key={key}>
        <Text style={styles.text}>
          {value.replace(value[0], value[0].toUpperCase())}
        </Text>
        <Text style={[styles.text, { textAlign: "right" }]}>
          {values[value]}
        </Text>
      </View>
    );
    key++;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "red" }}>
      <StatusBar
        backgroundColor="#fff"
        translucent={true}
        animated={true}
        style="dark"
      />
      <View style={styles.logoContainer}>
        <Logo width={150} height={100} />
      </View>
      <View style={styles.container}>
        <View style={styles.mainTextContainer}>{valuesArr}</View>
        <View style={{ gap: 10 }}>
          <Text
            style={[
              styles.button,
              { backgroundColor: isLoading ? "#7ba7cc" : "steelblue" },
            ]}
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
          <Text
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
            style={[
              styles.button,
              { backgroundColor: isLoading ? "#7ba7cc" : "steelblue" },
            ]}
            selectable={false}
            disabled={isLoading}
          >
            Abbrechen
          </Text>
        </View>
        {/* 
        Showing modal after the request is successfully done
      */}
        {isModalVisible ? (
          <Drucker
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            data={data}
            params={{
              rmNr: values.rmNr,
              teileNr: values.teileNr,
              menge: values.mengeNr,
              tr: values.tr,
              anzScans: values.anzScans,
            }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    padding: 30,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  mainTextContainer: {
    flex: 0.8,
    width: "100%",
    padding: 20,
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  textContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
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
