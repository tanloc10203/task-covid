import clsx from 'clsx';
import React from 'react';
import Loading from '../../../../components/Loading';
import styles from "./Card.module.scss";
import CountUp from 'react-countup';

function Card({ title, type, number, loading }) {
  return (
    <div className={clsx(styles.card, {
      [styles.success]: type === "success",
      [styles.warning]: type === "warning",
      [styles.danger]: type === "danger"
    })}>
      <div className={styles.cardTitle}>
        {title}
        <span>
          {
            loading
              ? <Loading />
              : (
                number !== undefined
                  ? <CountUp end={number} separator=',' duration={2} />
                  : "Không xác định"
              )
          }
        </span>
      </div >
    </div>
  )
}

export default Card;

