import React, { useMemo } from 'react';
import { useSelect } from '../../HOC';
import Card from './components/Card';
import "./index.scss";

function Cards() {
  const { data_country, isLoadingDataSummary } = useSelect("countries");

  const surmary = useMemo(() => {
    if (data_country) {
      return [
        {
          title: "Tổng số ca mắc",
          type: "warning",
          number: data_country?.cases,
        },
        {
          title: "Tổng số ca tử vong",
          type: "danger",
          number: data_country?.deaths,
        },
        {
          title: "Tổng số ca khỏi",
          type: "success",
          number: data_country?.recovered,
        }
      ]
    }
  }, [data_country])

  return (
    <main className="surmary">
      {surmary?.map((item, i) => (
        <Card
          title={item.title}
          type={item.type}
          number={item.number}
          loading={isLoadingDataSummary}
          key={i}
        />
      ))}
    </main>
  )
}

export default Cards

