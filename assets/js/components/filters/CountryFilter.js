import React from 'react';

const CountryFilter = (props) => {
    const {countries, setChangeCountry} = props;
    return (
        <div>
            <select name="" id="" className={'form-control'} onChange={(e) => {
                setChangeCountry(e.target.value);
            }}>
                <option value="">Choose a country</option>
                {countries.map(c => <option key={c.id} id={c.id}>{c.name}</option>)}
            </select>
        </div>
    );
}

export default CountryFilter;