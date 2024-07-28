import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import QRCode from "react-native-qrcode-svg";

type OfferDetailsProps = {
  title: string;
  discount: string;
  points: string;
};

const OfferDetails = ({ title, discount, points }: OfferDetailsProps) => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Offer Details",
      headerBackTitle: "Instagram",
    });
  }, [navigation]);
