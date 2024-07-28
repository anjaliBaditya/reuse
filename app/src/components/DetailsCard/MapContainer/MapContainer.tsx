import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Image, Linking, TouchableOpacity } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { getCollectionPointsNearby } from '../../collectionPoints';

Mapbox.setAccessToken(
    "pk.eyJ1IjoibWJtcGgiLCJhIjoiY2tya2F0OTJvMGk1YjJwbGZ1bDJ1eGU0dCJ9.fLJp01SsIpdhGmWdBzaSnQ"
);

type Props = {};

const MapContainer = (props: Props) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log(location);
            setLocation(location);
        })();
    }, []);

    useEffect(() => {
        if (!location) return

        // console.log(getCollectionPointsNearby(location.coords.latitude, location.coords.longitude))
    }, [location])

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    const openGoogleMaps = (lat: number, lon: number) => {
        console.log(location.coords.latitude, location.coords.longitude)

        const sourceLatitude = location.coords.latitude;
        const sourceLongitude = location.coords.longitude;

        const destinationLatitude = lat;
        const destinationLongitude = lon;

        const url = `https://www.google.com/maps/dir/?api=1&origin=${sourceLatitude},${sourceLongitude}&destination=${destinationLatitude},${destinationLongitude}`;

        Linking.openURL(url);
    };


    return (
        <View style={styles.page}>
            <View style={styles.container}>


                       
            </View>
        </View>
    )
}


export default MapContainer;
