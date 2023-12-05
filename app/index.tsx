// Dependencies
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  Alert,
  Keyboard,
} from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Counter from "../components/Counter";

// Main Component - Homepage
export default function App() {
  // States
  const [rmNr, setRmNr] = useState<String>("");
  const [teileNr, setTeileNr] = useState<String>("");
  const [menge, setMenge] = useState<number>(0);
  const [tr, setTr] = useState<String>("T");
  const [anzScans, setAnzScans] = useState<number>(0);
  const [letzteMenge, setLetzteMenge] = useState<number>(0);
  // Scan function
  const scanBehandlung = (newScan: String) => {
    const regex = /([0-9]{8})([0-9]{4}[T|R][0-9]{4})([0-9]+-?[0-9]+)/;
    const result = newScan.match(regex);
    // Checking, if input matches regex
    if (result !== null) {
      const neueTr = result[2].includes("R") ? "R" : "T";
      const neueMenge: number = +result[2].split(neueTr, 1)[0];
      const neueTeileNr: String = result[3];
      const neueRmNr: String = result[1];
      const updateData = () => {
        result[2].includes("R") ? setTr("R") : "";
        setLetzteMenge(neueMenge);
        setMenge(menge + neueMenge);
        setAnzScans(anzScans + 1);
        setRmNr(neueRmNr);
        setTeileNr(neueTeileNr);
      };
      const resetData = () => {
        setTr("T");
        setMenge(0);
        setLetzteMenge(0);
        setAnzScans(0);
        setRmNr("");
        setTeileNr("");
      };
      // Checking if values are empty => (first Scan)
      if (!rmNr && !teileNr && !menge) {
        updateData();
      } else {
        // Checking if the same barcode scanned again
        if (
          rmNr === neueRmNr &&
          teileNr === neueTeileNr &&
          neueMenge === letzteMenge
        ) {
          Alert.alert(
            "Gleicher Barcode",
            "Der gleiche Barcode wurde nochmal gescannt. War das absichtig?",
            [
              {
                text: "Nein",
                onPress: () => "",
                style: "cancel",
              },
              {
                text: "Ja",
                onPress: () => {
                  updateData();
                },
              },
            ]
          );
        } else if (
          // Checking if only the scan amount is different
          rmNr === neueRmNr &&
          teileNr === neueTeileNr &&
          letzteMenge !== neueMenge
        ) {
          updateData();
        } else {
          Alert.alert("Fehler!", "Die Barcodes stimmen nicht überein!");
          resetData();
        }
      }
    } else {
      Alert.alert("Fehler!", "Ungültiger Barcode");
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Counter anzScans={anzScans} />
        <TextInput
          autoFocus={true}
          showSoftInputOnFocus={false}
          onFocus={() => Keyboard.dismiss()}
          onBlur={(e) => e.target.focus()}
          onChangeText={(e) => scanBehandlung(e)}
          blurOnSubmit={false}
          caretHidden={true}
          value={""}
        />
        <Link
          href={{
            pathname: "/uebersicht",
            params: {
              rmNr: rmNr,
              teileNr: teileNr,
              menge: menge,
              tr: tr,
              anzScans: anzScans,
            },
          }}
          style={styles.link}
          selectable={false}
        >
          Drucken
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
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
    shadowColor: "#000",
    elevation: 5,
  },
});
