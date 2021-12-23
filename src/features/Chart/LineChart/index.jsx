import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { useDispatch } from 'react-redux';
import Loading from '../../../components/Loading';
import { useSelect } from "../../../HOC";
import { getCountryDataByDay, setState } from '../../../redux/slices/CountrySlice';
import { dataDay, getArrByObj } from '../../../utils';
import styles from "./LineChart.module.scss";

function LineChart() {
  const [data, setData] = React.useState({});
  const [options, setOptions] = React.useState({});
  const { data: datas, day, isLoading } = useSelect("country");
  const { iso2 } = useSelect("countries");
  const dispatch = useDispatch();

  React.useLayoutEffect(() => {
    let unmounted = false;
    !unmounted && dispatch(getCountryDataByDay(iso2, day));
    return () => unmounted = true;
  }, [dispatch, iso2, day]);

  React.useLayoutEffect(() => {
    if (datas && !_.isEmpty(datas)) {
      const { timeline: { cases, deaths } } = datas;
      const dataCases = getArrByObj(cases);
      const dataDeaths = getArrByObj(deaths);

      const newOptionsCases = {
        responsive: true,
        animation: false,
        plugins: {
          title: {
            display: true,
            text: 'Tổng số ca nhiễm và tử vong'
          },
        },
        scales: {
          y: {
            min: Math.min(...dataCases.map(item => item.value)),
            max: Math.max(...dataCases.map(item => item.value)),
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              text: 'Ca nhiễm',
              display: true,
            }
          },
          y1: {
            min: Math.min(...dataDeaths.map(item => item.value)),
            max: Math.max(...dataDeaths.map(item => item.value)),
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              text: 'Ca tử vong',
              display: true,
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      }

      const newData = {
        labels: [...dataCases.map(item => item.date)],
        datasets: [
          {
            label: 'Ca nhiễm',
            fill: false,
            data: [...dataCases.map(item => item.value)],
            backgroundColor: '#7fa5e3',
            borderColor: '#7fa5e3',
            yAxisID: 'y'
          },
          {
            label: 'Ca tử vong',
            fill: false,
            data: [...dataDeaths.map(item => item.value)],
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'y1'
          }
        ],
      }
      setData(newData);
      setOptions(newOptionsCases);
    }
  }, [datas]);

  const chart = React.useMemo(() => {
    if (datas && !_.isEmpty(datas))
      return <Line data={data} options={options} />;
    else return "Không có dữ liệu...";
  }, [data, options, datas]);

  return (
    <>
      <div className={clsx(styles.lineChart, 'container')}>
        <div className={styles.lineChartChangeDay}>
          <p>Chọn số ngày hiển thị{" "}</p>
          {dataDay?.map((item, index) => (
            <button
              key={index}
              className={clsx(styles.btnLineChart, {
                [styles.active]: day === item.value
              })}
              onClick={() => dispatch(setState(item.value))}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div style={{minHeight: "400px"}}>
          {isLoading
            ? <Loading />
            : <>{chart}</>
          }
        </div>
      </div>
    </>
  )
}

export default LineChart;

