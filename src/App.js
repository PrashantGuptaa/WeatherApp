import './App.css';
import NavBar from './Components/NavBar';
import {  CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { majorCities, noDataAvailableMessage, weatherAPIkey } from './constants';
import Card from './Components/Card';
import React, { useState, useEffect, useRef } from 'react';

function App() {
  let [loader, setLoader] = useState(true);
  let [weatherData, setWeatherData] = useState([]);
  let [searchValue, setsearchValue] = useState("");

   const timeoutidRef = useRef(null);

  useEffect(async () => {
    let data = [];
    if(!searchValue){
    for(let i = 0 ; i< majorCities.length ; i++) {
      const dataObj = await fetchDataFromAPI(majorCities[i]);
      data.push(dataObj);
     }
     setWeatherData(data);
     setLoader(false);
     } else {
      setLoader(true);
       clearTimeout(timeoutidRef.current); // clearing the previous timeout, so no call to server
     let id = setTimeout(async() =>{  // storing timeout ID, using useref hook
       const dataObj = await fetchDataFromAPI(searchValue);
       data.push(dataObj);
       setWeatherData(data);
       setLoader(false);
      },300);
      timeoutidRef.current = id;
     }
  }, [searchValue]);

 const fetchDataFromAPI = async (cityName) => {
   try{
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherAPIkey}`);
    let { main, weather, sys, name, wind } = response.data;
    return{
      city: name,
      country: sys.country,
      temperature: parseInt(main.temp - 273) +" °C",
      wind: wind.speed+" m/s",
      weather: weather[0].main,
    }
  }catch(err) {
    console.error("ERROR while fetching data", err);
    return {
      city: noDataAvailableMessage,
      country: noDataAvailableMessage,
      temperature: noDataAvailableMessage,
      wind: noDataAvailableMessage,
      weather: noDataAvailableMessage,
    }
  }
  }

 const getweatherData = () => {
   const weatherCards = [];
   weatherData.forEach((data, index) => {
    const { city, weather, country, temperature, wind } = data;
    weatherCards.push(
      <Card
        key={index}
        city={city}
        country={country}
        temperature={temperature}
        wind={wind}
        weather={weather}
      />
    );
   });
  return weatherCards;
  }

  const handleSearchChange = (e) => {
    setsearchValue(e.target.value);
  }
  return (
    <div className='App'>
      <NavBar 
      handleSearchChange={handleSearchChange}
      searchValue={searchValue}
      />
     {loader  ? <div className='loader'><CircularProgress /></div> :<div className='cards'>{getweatherData()}</div>}
    </div>
  );
}

export default App;
