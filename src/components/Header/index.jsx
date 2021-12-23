import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CountriesSelect from '../../features/CountriesSelect';
import { useSelect } from '../../HOC';
import { setState } from '../../redux/slices/CountriesSlice';
import Loading from '../Loading';
import styles from "./Header.module.scss";

function Header() {
  const dispatch = useDispatch();
  const state = useSelect("countries");
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const scrollCallback = window.addEventListener("scroll", () => {
      if (!unmounted) {
        if (window.pageYOffset > 0) setScroll(true);
        else setScroll(false);
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallback);
      unmounted = true;
    }
  }, [scroll]);

  const handleChangeCountries = useCallback(country => {
    dispatch(setState(country));
  }, [dispatch]);

  return (
    <>
      {
        state.isLoading
          ? <Loading />
          : (
            < div
              className={clsx(styles.header, {
                [styles.active]: scroll
              })
              }
            >
              <p className={styles.title}>News</p>
              <CountriesSelect
                title="Quốc gia"
                onChangeCountry={handleChangeCountries}
                value={state.iso2}
                data={state && state.data && state.data}
              />
            </div >
          )
      }
    </>
  )
}

export default Header;

