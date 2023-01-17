import { useState, useCallback, memo, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

import { HalfMalf } from "../lib/spinner-loader/index";
import "../lib/spinner-loader/index.css";

function Gmap({ lat, long, markers, showMarkers }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GMAP_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [show, setShow] = useState(false);

  const [latitude, setLatitude] = useState(lat);
  const [longitude, setLongitude] = useState(long);

  const [zoom, setZoom] = useState(8);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const placeMarkers = (getMarkers) => {

    let i = 0;
    let m = getMarkers.map((marker) => {
      return (
        <MarkerF
          key={i++}
          position={{ lat: marker.latitude, lng: marker.longitude }}
        />
      );
    });

    return m;
  };

  return isLoaded ? (
    showMarkers ? (
      <GoogleMap mapContainerClassName="map-container" center={{ lat:0, lng:0 }} zoom={1.5}>
        {placeMarkers(markers)}
      </GoogleMap>
    ) : (
      <GoogleMap
        mapContainerClassName="map-container"
        center={{ lat: lat, lng: long }}
        zoom={zoom}
      >
        <MarkerF
          position={{ lat: lat, lng: long }}
          title="Hello World"
          // icon={{ url: "markers/blue-tip-64.png", scale: 1 }}
        />
      </GoogleMap>
    )
  ) : (
    <></>
  );
}

export default memo(Gmap);
