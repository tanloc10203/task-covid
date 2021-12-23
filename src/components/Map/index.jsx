import lookup from 'country-code-lookup';
import mapboxgl from "mapbox-gl";
import React from "react";
import { useSelect } from "../../HOC";
import styles from "./Map.module.scss";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function Map() {
  const { data_country_point: datas, data_country } = useSelect("countries");
  const mapboxElRef = React.useRef(null);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    if (datas && datas?.length) {
      const newData = datas.map((point, index) => {
        const { coordinates: { latitude, longitude } } = point;
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          properties: {
            id: index,
            country: point.country,
            province: point?.province,
            cases: point.stats.confirmed,
            deaths: point.stats.deaths,
          }
        }
      });
      setData(newData);
    }

  }, [datas]);

  React.useEffect(() => {
    if (data && data.length) {
      const average = data.reduce((total, next) => total + next.properties.cases, 0) / data.length;
      const min = Math.min(...data.map(item => item.properties.cases));
      const max = Math.max(...data.map(item => item.properties.cases));

      const map = new mapboxgl.Map({
        container: mapboxElRef?.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [105.8, 21],
        zoom: 3,
        localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif"
      });

      map.addControl(new mapboxgl.NavigationControl());

      map.addControl(
        new mapboxgl.GeolocateControl({
          fitBoundsOptions: { maxZoom: 5 }
        })
      );

      map.once('load', () => {
        map.addSource('points', {
          type: 'geojson',
          data: {
            type: "FeatureCollection",
            features: data
          }
        });

        map.addLayer({
          id: "circles",
          source: "points",
          type: "circle",
          paint: {
            'circle-stroke-color': "#202124",
            'circle-opacity': 0.75,
            'circle-stroke-width': ['interpolate', ['linear'], ['get', 'cases'], 1, 1, max, 2],
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'cases'],
              1, min, 1000,
              8, average / 4, 10,
              average / 2, 14,
              average, 18, max, 50
            ],
            'circle-color': [
              'interpolate', ['linear'], ['get', 'cases'],
              min, '#ffffb2', max / 32, '#fed976', max / 16,
              '#feb24c', max / 8, '#fd8d3c', max / 4,
              '#fc4e2a', max / 2, '#e31a1c', max, '#b10026'
            ],
          }
        });

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        let lastId;

        map.on("mousemove", "circles", e => {
          const features = e.features[0];
          const id = features.properties.id;
          if (id !== lastId) {
            lastId = id;

            const { cases, deaths, country, province } = features.properties;
            map.getCanvas().style.cursor = "pointer";
            const coordinates = features.geometry.coordinates.slice();

            const countryISO = lookup.byCountry(country)?.iso2 || lookup.byInternet(country)?.iso2;
            const provinceHTML = province !== undefined ? `<p>Province: <b>${province}</b></p>` : '';
            const mortalityRate = ((deaths / cases) * 100).toFixed(2);
            const countryFlagHTML = Boolean(countryISO)
              ? `<span class="flag-icon flag-icon-${countryISO.toLowerCase()}"></span>`
              : "";

            const HTML = `
              <p>Country: <b>${country}</b></p>
              ${provinceHTML}
              <p>Cases: <b>${cases?.toLocaleString(undefined, { mininumFractionDigits: 0 })}</b></p>
              <p>Deaths: <b>${deaths?.toLocaleString(undefined, { mininumFractionDigits: 0 })}</b></p>
              <p>Mortality Rate: <b>${mortalityRate}%</b></p>
              ${countryFlagHTML}
            `;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            popup.setLngLat(coordinates).setHTML(HTML).addTo(map);
          }
        });

        map.on('mouseleave', 'circles', () => {
          lastId = undefined;
          map.getCanvas().style.cursor = '';
          popup.remove();
        });

        const { countryInfo: { lat, long } } = data_country;

        map.flyTo({
          center: [long, lat],
          essential: true,
          zoom: 5,
          easing: t => t,
          curve: 1,
          speed: 1.2,
          bearing: 1
        });
      });
    }
  }, [data, data_country]);

  return (
    <div className="map">
      <div className="map-container">
        <div className={styles.mapBox} ref={mapboxElRef} />
      </div>
    </div>
  );
}

export default Map;

