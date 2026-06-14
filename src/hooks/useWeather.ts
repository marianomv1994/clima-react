import axios from "axios"
import {z} from 'zod'
//import * as v from 'valibot';
import type { SearchType } from "../types"
import { useMemo, useState } from "react"



//type guard o assertion segunda opcion
/*
function isWeatherResponse(weather:unknown) : weather is Weather {
    return (
        Boolean(weather) &&
        typeof weather === 'object' &&
        typeof (weather as Weather).name === 'string' &&
        typeof (weather as Weather).main.temp === 'number' &&
        typeof (weather as Weather).main.temp_max === 'number' &&
        typeof (weather as Weather).main.temp_min === 'number'
    )        
}
*/

// Zod tercera opcion y es la recomendada pero no es modular

const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number(),
    })
})
export type Weather = z.infer<typeof Weather>


//valibot
/*
const WeatherScheman = v.object({
    name: v.string(),
    main: v.object({
        temp: v.number(),
        temp_max: v.number(),
        temp_min: v.number(),

    }),
});

type Weather = v.InferOutput<typeof WeatherScheman>
*/

const initialState = {
    name: '',
    main: ({
        temp: 0,
        temp_max: 0,
        temp_min: 0,
    })
}

export default function useWeather(){
    const [weather, setWeather] = useState<Weather>(initialState)
    const [loading, setLoaging] =useState(false)
    const [notFound, setNotFound] = useState(false)


    const fetchWeather = async (search: SearchType) => {
        setLoaging(true)
        setWeather(initialState)
        setNotFound(false)
        try {

            const appId = import.meta.env.VITE_API_KEY

            const geoUrl =`http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

            const {data} = await axios(geoUrl)

            //Comprobar si existe
            if(!data[0]){
                setNotFound(true)
                return
            }
            const lat = data[0].lat
            const lon = data[0].lon

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`
            // Castear el type primera opcion no recomendable
            /*
            const { data:weatherResult } = await axios<Weather>(weatherUrl)
            console.log(weatherResult.main.temp)
            console.log(weatherResult.main.temp_max)
            */

            //type Guards segunda opcion
            /*
            const { data:weatherResult } = await axios(weatherUrl)
            const result = isWeatherResponse(weatherResult)
            if(result){
                console.log(weatherResult.name)
            }
            */

            //Valibot
            /*
            const { data:weatherResult } = await axios(weatherUrl)
            const result = v.parse(WeatherScheman, weatherResult)
            if(result){
                console.log(result.name)
            }
            */
           //Zod tercera opcion y es la recomendada pero no es modular
            
            const { data:weatherResult } = await axios(weatherUrl)
            const result = Weather.safeParse(weatherResult)
            if(result.success){
                setWeather(result.data)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoaging(false)
        }
    }

    const hasWeatherData = useMemo(() => weather.name, [weather])
    return{
        weather,
        loading,
        notFound,
        hasWeatherData,
        fetchWeather
    }
}