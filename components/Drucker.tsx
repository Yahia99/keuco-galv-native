import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";

// Object's Interface
interface DruckerInterface {
  isModalVisible: boolean;
  setIsModalVisible: (arg: boolean) => void;
  data: {};
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
  // States
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  // Getting params from previous page
  const { rmNr, teileNr, menge, tr, scan } = params();
  // Sending POST request
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
    } catch (err) {
      setIsLoading1(false);
      setIsLoading2(false);
      alert(err);
    }
  };
  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <View style={styles.container}>
        <Pressable onPress={() => sendPrintReq()}>
          {/* 
            Showing Loader if the request still processing
          */}
          {isLoading1 ? (
            <Text style={styles.text}>
              <ActivityIndicator />
            </Text>
          ) : (
            <Text style={styles.text}>{"Drucker 1"}</Text> // data.printerName1
          )}
        </Pressable>
        <Pressable onPress={() => sendPrintReq()}>
          {isLoading2 ? (
            <Text style={styles.text}>
              <ActivityIndicator />
            </Text>
          ) : (
            <Text style={styles.text}>{"Drucker 2"}</Text> // data.printerName2
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
    backgroundColor: "#eaeaea",
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 10,
    justifyContent: "flex-end",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    alignItems: "stretch",
    alignSelf: "center",
  },
  text: {
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
