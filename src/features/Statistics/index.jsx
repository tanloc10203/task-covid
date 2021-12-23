import clsx from 'clsx';
import React from 'react';
import CountUp from 'react-countup';
import { useSelect } from "../../HOC";
import styles from "./Statistics.module.scss";
import Loading from "../../components/Loading";

function Statistics() {
  const { data, isLoading } = useSelect("countries");
  return (
    <div className={clsx("container", styles.main)}>
      {isLoading
        ? <Loading />
        : (
          <>
            <p>Số liệu thống kê</p>
            <div className={styles.table}>
              <table className={styles.tableMain}>
                <thead>
                  <tr>
                    <th>Quốc gia</th>
                    <th>Tổng ca nhiêm</th>
                    <th>Số ca mắc mới (hôm nay)</th>
                    <th>Số ca tử vong</th>
                    <th>Các trường hợp trên 1 triệu người</th>
                    <th>Số ca phục hồi</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    && data.length
                    ? data.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <img src={item.countryInfo?.flag} alt="" className={styles.img} />
                          {item.country}
                        </td>
                        <td><CountUp end={item.cases} separator=',' duration={2} /></td>
                        <td><CountUp end={item.todayCases} separator=',' duration={2} /></td>
                        <td><CountUp end={item.deaths} separator=',' duration={2} /></td>
                        <td><CountUp end={item.oneCasePerPeople} separator=',' duration={2} /></td>
                        <td><CountUp end={item.recovered} separator=',' duration={2} /></td>
                      </tr>
                    )) : null
                  }
                </tbody>
              </table>
            </div>
          </>
        )}
    </div>
  )
}

Statistics.propTypes = {

}

export default Statistics

