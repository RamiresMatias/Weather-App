const input = document.querySelector(".search-bar")
const btn = document.querySelector(".search button")
const temperatureEl = document.querySelector(".info-wheater .temperature")
const cityEl = document.querySelector(".info-wheater .city")
const condEl = document.querySelector(".info-wheater .condition h1")
const imgCondEl = document.querySelector(".info-wheater .condition img")
const forecastDiv = document.querySelector(".forecast")

navigator.geolocation.getCurrentPosition((position) => {
  console.log(position);  
})

function fetchApi(city) {
  const API_KEY = "3e3a70fc440b444a9d6142341220110"
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&lang=pt&days=7`)
    .then((response) => {
      response.json().then((data) => {
        if(data.cod == 404) {
            alert("Não foi possível encontrar a cidade!")
            return
        }

        mountInfo(data)
      })
    })
}

function mountInfo(data) {
    temperatureEl.textContent = `${Math.round(data.current.temp_c)}°C`
    cityEl.textContent = `${data.location.name}, ${data.location.country}`

    condEl.textContent = `${data.current.condition.text}`
    imgCondEl.src = formatterUrlIcon(data.current.condition.icon)

    const childrenForecast = data.forecast.forecastday.map((forecastDay) => {
        const div = document.createElement('div')
        const h3Date = document.createElement('h3')
        const h3Temp = document.createElement('h3')
        const imgIcon = document.createElement('img')

        div.classList.add('card-day')

        imgIcon.src = formatterUrlIcon(forecastDay.day.condition.icon)
        h3Date.textContent = formatterDate(forecastDay.date)
        h3Temp.textContent = `${formatterTemperature(forecastDay.day.maxtemp_c)}  -  ${formatterTemperature(forecastDay.day.mintemp_c)}`

        div.appendChild(h3Date)
        div.appendChild(imgIcon)
        div.appendChild(h3Temp)

        return div
    })
    forecastDiv.innerHTML = null
    forecastDiv.append(...childrenForecast)
}

function formatterUrlIcon(url) {
    return `https://${url.replace('//', '')}`
}

function formatterDate(date) {
    return `${new Date(date).toLocaleString('pt-BR', {weekday: 'long'})} `
}

function formatterTemperature(temp) {
    return `${Math.round(temp)}°C`
}

btn.addEventListener("click", function (event) {
    event.preventDefault()
    event.stopPropagation()

    fetchApi(input.value)
})

input.addEventListener("keyup", function (event) {
    event.preventDefault()
    event.stopPropagation()

    if (event.key == "Enter") {
      fetchApi(event.target.value)
    }
})
