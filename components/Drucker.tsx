import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import axios from "axios";

// Interface
interface DruckerInterface {
  isModalVisible: boolean;
  setIsModalVisible: (arg: boolean) => void;
  data: {
    name: string;
    display: string;
    path: string;
  }[];
  params: () => {
    rmNr: string;
    teileNr: string;
    menge: string;
    tr: string;
    anzScans: string;
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
  const { rmNr, teileNr, menge, tr, anzScans } = params();
  const controller = new AbortController();
  // Sending POST request
  const sendPrintReq = async (druckerNum: number) => {
    try {
      druckerNum === 0 ? setIsLoading1(true) : setIsLoading2(true);
      await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        {
          printer: data[druckerNum].name,
          summary: {
            conf: rmNr,
            part: teileNr,
            sum: menge,
            tr: tr,
            count: anzScans,
          },
        },
        {
          signal: controller.signal,
          headers: {
            "content-type": "application/json",
          },
        }
      );
      setIsLoading1(false);
      setIsLoading2(false);
      setIsModalVisible(false);
      Alert.alert("Erfolg!", "Abfrage erfolgreich geschickt");
    } catch (err) {
      setIsLoading1(false);
      setIsLoading2(false);
      Alert.alert("Fehler!", err.message);
    } finally {
      // Cleaner Function
      return () => {
        controller.abort();
      };
    }
  };

  const newData = [
    { id: 1, name: "Drucker 1", display: "Drucker 1" },
    { id: 2, name: "Drucker 2", display: "Drucker 2" },
  ];

  return (
    <Modal animationType="slide" visible={isModalVisible} transparent={true}>
      <View style={styles.container}>
        <FlatList
          data={newData}
          renderItem={({ item, index }) => (
            <Text
              style={styles.text}
              selectable={false}
              onPress={() => sendPrintReq(index)}
              disabled={isLoading1 || isLoading2 ? true : false}
              key={index}
            >
              {(index === 0 ? isLoading1 : isLoading2) ? (
                <ActivityIndicator size={28} />
              ) : (
                item.display
              )}
            </Text>
          )}
        />
        <Pressable
          onPress={() => {
            setIsModalVisible(false);
          }}
          disabled={isLoading1 || isLoading2 ? true : false}
        >
          <Text style={styles.text} selectable={false}>
            Abbrechen
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "auto",
    maxHeight: 400,
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#eaeaea",
    paddingVertical: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
  text: {
    marginTop: 10,
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
