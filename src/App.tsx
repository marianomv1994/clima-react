import Alert from "./Alert/Alert"
import styles from "./App.module.css"
import Spinner from "./components/WeatherDetail/Spinner/Spinner"
import WeatherDetail from "./components/WeatherDetail/WeatherDetail"
import Form from "./Form/Form"
import useWeather from "./hooks/useWeather"
function App() {
  const {weather,loading,notFound,fetchWeather,hasWeatherData} = useWeather()
  

  return (
    <>
     <h1 className={styles.title}>Buscador de clima</h1>
      <div className={styles.container}>
        <Form fetchWeather={fetchWeather} />
        {loading &&  <Spinner/>}
        {hasWeatherData && <WeatherDetail weather={weather} /> }
        {notFound && <Alert>Ciudad No Encontrada</Alert>}
          
        
      </div>
    </>
  )
}

export default App
