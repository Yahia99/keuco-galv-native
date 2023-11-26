import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";

interface DruckerInterface {
  isModalVisible: boolean;
  setIsModalVisible: (arg: boolean) => void;
  data: { printerName1: String; printerName2: String };
  params: () => {
    rmNr: string;
    teileNr: string;
    menge: string;
    tr: string;
    scan: string;
  };
}

export default function Drucker({
  isModalVisible,
  setIsModalVisible,
  data,
  params,
}: DruckerInterface) {
  const { rmNr, teileNr, menge, tr, scan } = params();
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const sendPrintReq = async () => {
    try {
      setIsLoading1(true);
      setIsLoading2(true);
      await fetch("https://galv.keuco.local", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          rmNr: rmNr,
          teileNr: teileNr,
          menge: menge,
          tr: tr,
          scan: scan,
        }),
      });
      alert("Request Success");
      setIsModalVisible(false);
      console.log("Success!");
    } catch (error) {
      setIsLoading1(false);
      setIsLoading2(false);
      alert("Request failed");
      console.log(error);
    }
  };
  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <View style={styles.container}>
        <Pressable onPress={() => sendPrintReq()}>
          {isLoading1 ? (
            <Text style={styles.text}>
              <ActivityIndicator />
            </Text>
          ) : (
            <Text style={styles.text}>{data.printerName1}</Text>
          )}
        </Pressable>
        <Pressable onPress={() => sendPrintReq()}>
          {isLoading2 ? (
            <Text style={styles.text}>
              <ActivityIndicator />
            </Text>
          ) : (
            <Text style={styles.text}>{data.printerName2}</Text>
          )}
        </Pressable>
        <Pressable onPress={() => setIsModalVisible(false)}>
          <Text style={styles.text}>Abbrechen</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "auto",
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 10,
    justifyContent: "flex-end",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    alignItems: "stretch",
  },
  text: {
    padding: 25,
    fontSize: 20,
    color: "#fff",
    backgroundColor: "steelblue",
    borderRadius: 10,
    textAlign: "center",
  },
});
