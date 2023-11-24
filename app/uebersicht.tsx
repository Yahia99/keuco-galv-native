import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import Drucker from "../components/Drucker";
import { useLink } from "expo-router/build/hooks";

export default function Uebersicht() {
  const { rmNr, teileNr, menge, tr, scan } = useLocalSearchParams();
  const [data, setData] = useState([{}]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const getDrucker = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const json: {}[] = await response.json();
      setData(json);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getDrucker();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
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
      <View style={styles.buttonsConstainer}>
        <Pressable style={styles.pressable} onPress={() => showModal()}>
          <Text style={{ fontSize: 20, color: "#fff", textAlign: "center" }}>
            Drucker Auswählen
          </Text>
        </Pressable>
        <Link
          href={{
            pathname: "/",
            params: {
              rmNr: rmNr,
              teileNr: teileNr,
              menge: menge,
              tr: tr,
              scan: scan,
            },
          }}
          style={styles.link}
        >
          Abbrechen
        </Link>
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
  buttonsConstainer: {
    gap: 10,
  },
  pressable: {
    width: "100%",
    paddingTop: 25,
    paddingBottom: 25,
    fontSize: 20,
    color: "#fff",
    backgroundColor: "steelblue",
    borderRadius: 10,
    textAlign: "center",
  },
  link: {
    width: "100%",
    paddingTop: 25,
    paddingBottom: 25,
    fontSize: 20,
    color: "#fff",
    backgroundColor: "steelblue",
    borderRadius: 10,
    textAlign: "center",
  },
});
