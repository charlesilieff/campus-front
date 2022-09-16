import { Dayjs } from 'dayjs';
import React from 'react';

interface IProps {
  positionX: number;
  date: Dayjs;
}

export const Day = ({ positionX, date }: IProps) => {
  const dayWeek = date.day();
  const dayMonth = date.date();
  const style = { gridColumnStart: positionX, gridColumnEnd: positionX + 1, borderLeftWidth: '0.01em' } as React.CSSProperties;
  if (positionX === 8 || date.date() === 1 || date.day() === 1) {
    style.borderLeftWidth = '0.2em';
  }

  return (
    <>
      <div className="day" style={style}>
        {date.format('ddd DD ')}
      </div>
      <div
        style={
          {
            gridColumnStart: positionX,
            gridColumnEnd: positionX + 1,
            gridRowStart: 4,
            gridRowEnd: 50,
            borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
            borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          } as React.CSSProperties
        }
      ></div>
    </>
  );
};

export default Day;
