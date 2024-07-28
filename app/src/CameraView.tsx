import { BlurView } from "expo-blur";
import { FlipType, SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, View, Text } from "react-native";
import MlkitOdt, {
  ObjectDetectionResult,
  ObjectDetectorMode,
} from "react-native-mlkit-odt";
import {
  Camera,
  PhotoFile,
  useCameraDevice,
  useCameraFormat,
} from "react-native-vision-camera";
import DetailsCard from "./components/DetailsCard/DetailsCard";
import { convertToObject } from "typescript";
import { BoundingBoxResult, GptClassification } from "./BoundingBoxResult";

const getObjectDetectionResult = (photo: PhotoFile) => {
  return MlkitOdt.detectFromUri("file:///" + photo.path, {
    detectorMode: ObjectDetectorMode.STREAM,
    shouldEnableClassification: false,
    shouldEnableMultipleObjects: false,
  });
};

const getBoundingBox = (
  photo: PhotoFile,
  detection: ObjectDetectionResult | undefined,
  lastBox: BoundingBoxResult | undefined
): BoundingBoxResult | undefined => {
  if (!detection) return;
  const { bounding } = detection;

  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const { width: photoWidth, height: photoHeight } = photo;

  const normalized = {
    top: bounding.originX / photoWidth,
    leftEdgeFromRight: bounding.originY / photoHeight,
    height: bounding.width / photoWidth,
    width: bounding.height / photoHeight,
  };

  return {
    photo,
    detection,
    top: normalized.top * windowHeight,
    left:
      windowWidth -
      normalized.width * windowWidth -
      normalized.leftEdgeFromRight * windowWidth,
    height: normalized.height * windowHeight,
    width: normalized.width * windowWidth,
    sameIdRepetition:
      lastBox?.detection.trackingID === detection.trackingID
        ? lastBox.sameIdRepetition + 1
        : 0,
    classification:
      lastBox?.detection.trackingID === detection.trackingID
        ? lastBox.classification
        : undefined,
  };
};

const cropBoundingBox = async ({ photo, detection }: BoundingBoxResult) => {
  console.log("photo", photo.width, photo.height);
  const originY = Math.max(
    0,
    detection.bounding.originX - detection.bounding.width * 0.1
  );
  const originX = Math.max(
    0,
    photo.height -
    detection.bounding.height -
    detection.bounding.originY -
    detection.bounding.height * 0.1
  );
  const height = Math.min(
    photo.width - originX,
    detection.bounding.width * 1.2
  );
  const width = Math.min(
    photo.height - originY,
    detection.bounding.height * 1.2
  );

  const manipResult = await manipulateAsync(
    photo.path,
    [
      {
        crop: {
          originX,
          originY,
          width,
          height,
        },
      },
    ],
    { base64: true, compress: 1, format: SaveFormat.JPEG }
  );
  return manipResult;
};

const uploadToGpt = async (imageBase64: string) => {
  // TODO
  const body = JSON.stringify({
    image: imageBase64,
  });
  console.log("asking GPT");
  // console.log(imageBase64)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // return {
  //   item_name: "Power Bank",
  //   saved_CO2_kg: 15,
  //   comparision: "= planting 30 trees",
  // };

  const res = await fetch(
    "https://1758-2001-14bb-111-af71-7129-ba19-4a5b-3a55.ngrok-free.app/generate-response",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    }
  );
  if (!res.ok) {
    console.log(res.status);
    throw new Error("Failed to upload to GPT");
  }

  console.log("got GPT response");

  const json = await res.json();
  return json as GptClassification;
};


  return (
    <>
      
    </>
  );
};
