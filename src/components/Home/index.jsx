import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cards from '../../features/Cards';
import LineChart from '../../features/Chart/LineChart';
import Map from '../../features/Map';
import Statistics from '../../features/Statistics';
import { useSelect } from '../../HOC';
import { getCountries, getCountriesPoint, getDataSummary } from '../../redux/slices/CountriesSlice';
import Footer from '../Footer';
import Header from '../Header';

function Home() {
  const state = useSelect("countries");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCountriesPoint());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDataSummary(state.iso2));
  }, [dispatch, state.iso2]);

  return (
    <main>
      <Header />
      <Map />
      <Cards />
      <LineChart />
      <Statistics />
      <Footer ></Footer>
    </main>
  )
}


export default React.memo(Home);

