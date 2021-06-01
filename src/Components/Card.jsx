import React, { useState } from 'react';
import './Component.css';

const Card = ({temperature, wind, weather, city, country }) => {
    return ( 
        <div className='weatherCard'>
        <p>Country: {country}</p>
        <p>City: {city}</p>
        <p>Wind: {wind}</p>
        <p>Weather: {weather}</p>
        <p>Temperature: {temperature}</p>
        </div>
     );
}
 
export default Card;