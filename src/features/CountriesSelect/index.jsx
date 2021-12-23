import clsx from 'clsx';
import _ from 'lodash'
import React from 'react'
import styles from "./CountriesSelect.module.scss";

function CountriesSelect({ title, data, value, onChangeCountry }) {
  const [toggle, setToggle] = React.useState(false);
  const closeRef = React.useRef(null);
  const [country, setCountry] = React.useState({});

  React.useEffect(() => {
    const handleMouseDown = e => {
      if (closeRef.current && !closeRef.current?.contains(e.target))
        setToggle(false);
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [closeRef]);

  React.useEffect(() => {
    if (data && data.length) {
      const newData = data.find(item => item.countryInfo?.iso2 === value);
      setCountry(newData);
    }
  }, [data, value]);

  return (
    <div className={styles.main}>
      <div className={styles.mainSelected}>
        <p>{title}</p>
        <div
          className={styles.optionsValue}
          onClick={() => setToggle(!toggle)}
          ref={closeRef}
        >
          {country
            && !_.isEmpty(country)
            && (
              <>
                <div className={styles.optionInfor}>
                  {< img src={country?.countryInfo?.flag} alt="" />}
                  {country.country}
                </div>
                <i className={`fas fa-chevron-${toggle ? 'up' : 'down'}`}></i>
              </>
            )
          }
          <div
            className={clsx(styles.option, {
              [styles.open]: toggle
            })}
          >
            {data
              && !_.isEmpty(data)
              && data.map((country, i) => (
                <div
                  className={styles.listOption}
                  key={i}
                  onClick={() => onChangeCountry(country?.countryInfo.iso2)}
                  style={{ background: country?.countryInfo.iso2 === value && "rgba(0, 0, 0, 0.05)" }}
                >
                  <img src={country?.countryInfo?.flag} alt="" />
                  <p>{country.country}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div >
  )
}

CountriesSelect.defaultProps = {
  data: []
}

export default CountriesSelect

