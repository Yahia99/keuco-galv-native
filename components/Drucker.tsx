import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Modal } from "react-native";

interface DruckerInterface {
  isModalVisible: boolean;
  setIsModalVisible: (arg: boolean) => void;
  data: { userId?: number; id?: number; title?: String; completed?: boolean }[];
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
  const sendPrintReq = async () => {
    try {
      const response = await fetch("https://galv.keuco.local", {
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
      console.log("Success!");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <View style={styles.container}>
        <Pressable style={styles.pressable} onPress={() => sendPrintReq()}>
          <Text style={styles.text}>{data[0].title}</Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={() => sendPrintReq()}>
          <Text style={styles.text}>{data[2].title}</Text>
        </Pressable>
        <Pressable
          onPress={() => setIsModalVisible(!isModalVisible)}
          style={styles.pressable}
        >
          <Text style={styles.text}>Abbrechen</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "50%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fafafa",
    padding: 20,
    gap: 20,
    justifyContent: "space-between",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    alignItems: "center",
  },
  pressable: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
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
