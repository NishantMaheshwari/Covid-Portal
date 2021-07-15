import React, {useState,useEffect, useContext} from "react";
import { NativeSelect,FormControl } from "@material-ui/core";
import styles from "./CountryPicker.module.css";
import {fetchCountries} from "../../api/api";
import { fetchStates } from "../../api/api";
import { UserContext } from "../../UserContext";

const CountryPicker = ({handleCountryChange,handleStateChange,handleDistrictChange,state,country,statelist,districtlist}) => {
  const {user} = useContext(UserContext);
  
  const [fetchedCountries, setfetchedCountries] = useState([]);

  useEffect(()=>{
    const fetchAPI=async()=>{
      setfetchedCountries(await fetchCountries());
    }
    fetchAPI();
  },[setfetchedCountries]);


  return (
    <div>
      <div className={styles.flexContainer}>
        <div className="select">
        <select id="standard-select" onChange={(e)=>handleCountryChange(e.target.value)}>
          <option value="">Select Country</option>
          {fetchedCountries.map((country,i)=><option key={i} value={country._id}>{country.country}</option>)}
        </select>
        </div>
        <div className="select">
        <select id="standard-select" onChange={(e)=>handleStateChange(country,e.target.value)}>
          <option value="">State not Selected</option>
          {statelist.map((state,i)=><option key={i} value={state._id}>{state.state}</option>)}
        </select>
        </div>
        <div className="select">
        <select id="standard-select" onChange={(e)=>handleDistrictChange(country,state,e.target.value)}>
          <option value="">District not Selected</option>
          {districtlist.map((district,i)=><option key={i} value={district._id}>{district.district}</option>)}
        </select>
        </div>
      </div>
    </div>
  );
};

export default CountryPicker;
