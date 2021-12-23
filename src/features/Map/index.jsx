import _ from 'lodash';
import React from 'react';
import MapGL, { FlyToInterpolator, Layer, Source } from "react-map-gl";
import { useSelect } from '../../HOC';
import lookup from 'country-code-lookup';
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

function Map() {
  const mapRef = React.useRef(null);
  const { data_country_point: datas, data_country } = useSelect("countries");
  const [data, setData] = React.useState({});
  const [hoverInfo, setHoverInfo] = React.useState(null);
  const [dataLayer, setDataLayer] = React.useState({});
  const [viewport, setViewport] = React.useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
    bearing: 0,
    pitch: 0
  });

  React.useEffect(() => {
    if (data_country && !_.isEmpty(data_country)) {
      const { countryInfo: { lat, long } } = data_country;
      const newViewport = {
        longitude: +long,
        latitude: +lat,
        zoom: 11,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
        transitionDuration: 'auto'
      }
      setViewport(state => ({ ...state, ...newViewport }));
    }
  }, [data_country]);

  React.useEffect(() => {
    if (datas && datas.length) {
      const dataFeatures = datas.map((point, index) => {
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

      const newData = {
        type: "FeatureCollection",
        features: [...dataFeatures]
      }
      setData(newData);
    }
  }, [datas]);

  React.useEffect(() => {
    if (data && !_.isEmpty(data)) {
      const average = data.features.reduce((total, next) => total + next.properties.cases, 0) / data.features.length;
      const min = Math.min(...data.features.map(item => item.properties.cases));
      const max = Math.max(...data.features.map(item => item.properties.cases));

      const newLayer = {
        id: "data",
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
      }
      setDataLayer(newLayer);
    }
  }, [data]);

  const handleHover = React.useCallback(e => {
    const { features, srcEvent: { offsetX, offsetY } } = e;

    const hoveredFeature = features && features[0];
    let dataHover = {};

    if (hoveredFeature) {
      const { cases, deaths, country, province } = hoveredFeature?.properties;

      const countryISO = lookup.byCountry(country)?.iso2 || lookup.byInternet(country)?.iso2;
      const provinceHTML = province !== undefined || province !== '' ? province : '';
      const mortalityRate = ((deaths / cases) * 100).toFixed(2);
      const countryFlagHTML = Boolean(countryISO) ? countryISO.toLowerCase() : "";

      dataHover = {
        country,
        provinceHTML,
        cases,
        deaths,
        mortalityRate,
        countryFlagHTML,
      }
    }
    setHoverInfo(
      hoveredFeature
        ? {
          ...dataHover,
          x: offsetX,
          y: offsetY,
        }
        : null
    );
  }, []);

  return (
    <>
      {data_country && !_.isEmpty(data_country) && datas && datas.length ?
        <MapGL
          height={400}
          width="100%"
          {...viewport}
          onViewportChange={e => setViewport(e)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          dragRotate={false}
          interactiveLayerIds={['data']}
          ref={mapRef}
          maxZoom={10}
          onHover={handleHover}
        >
          {data && !_.isEmpty(dataLayer)
            ? <Source type="geojson" data={data}>
              <Layer {...dataLayer} />
            </Source>
            : null
          }
          {hoverInfo && !_.isElement(hoverInfo) && (
            <div className="tooltip" style={{ left: hoverInfo.x, top: hoverInfo.y }}>
              <p>Country: <b>{hoverInfo?.country}</b></p>
              {hoverInfo?.provinceHTML ? <p>Province: <b>{hoverInfo?.provinceHTML}</b></p> : null}
              <p>Cases: <b>{hoverInfo?.cases?.toLocaleString(undefined, { mininumFractionDigits: 0 })}</b></p>
              <p>Deaths: <b>{hoverInfo?.deaths?.toLocaleString(undefined, { mininumFractionDigits: 0 })}</b></p>
              <p>Mortality Rate: <b>{hoverInfo?.mortalityRate}%</b></p>
              <span className={`flag-icon flag-icon-${hoverInfo?.countryFlagHTML}`}></span>
            </div>
          )}
        </MapGL>
        : "Loading..."
      }
    </>
  )
}

Map.propTypes = {

}

export default Map

