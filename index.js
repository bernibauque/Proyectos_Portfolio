const apiKey ='2f78389be24c07ef246c641bb43dc584';
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');

// Mapeo de códigos de condiciones climáticas a nombres de clases de íconos (dependiendo de la respuesta de Openweather Api)
const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

function fetchWeatherData(location) {
    // Construye la URL de API con la ubicación y la clave de API
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    // Obtener datos meteorológicos de la API
    fetch(apiUrl).then(response => response.json()).then(data => {
        //Actualiza la información de hoy
        const todayWeather = data.list[0].weather[0].description;
        const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
        const todayWeatherIconCode = data.list[0].weather[0].icon;

        const dayName = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
        //Este código primero obtiene el nombre del día en español y luego capitaliza la primera letra utilizando
        //charAt(0).toUpperCase() y agrega el resto del nombre del día con slice(1)
        const formattedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        todayInfo.querySelector('h2').textContent = formattedDayName;

        todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

        todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
        todayTemp.textContent = todayTemperature;

        // Actualiza la ubicación y la descripción del clima en la sección "información izquierda"
        const locationElement = document.querySelector('.today-info > div > span');
        locationElement.textContent = `${data.city.name}, ${data.city.country}`;

        const weatherDescriptionElement = document.querySelector('.today-weather > h3');
        weatherDescriptionElement.textContent = todayWeather;

        //Actualiza la información de hoy en la sección "información del día"
        const todayPrecipitation = `${data.list[0].pop}%`;
        const todayHumidity = `${data.list[0].main.humidity}%`;
        const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

        const dayInfoContainer = document.querySelector('.day-info');
        dayInfoContainer.innerHTML = `

            <div>
                <span class="title">PRECIPITACIONES</span>
                <span class="value">${todayPrecipitation}</span>
            </div>
            <div>
                <span class="title">HUMEDAD</span>
                <span class="value">${todayHumidity}</span>
            </div>
            <div>
                <span class="title">VELOCIDAD VIENTO</span>
                <span class="value">${todayWindSpeed}</span>
            </div>

        `;

        // Actualizar el clima de los próximos 4 días
        const today = new Date();
        const nextDaysData = data.list.slice(1);

        const uniqueDays = new Set();
        let count = 0;
        daysList.innerHTML = '';
        for (const dayData of nextDaysData) {
            const forecastDate = new Date(dayData.dt_txt);
            const dayAbbreviation = forecastDate.toLocaleDateString('es-ES', { weekday: 'short' });
            const dayTemp = `${Math.round(dayData.main.temp)}°C`;
            const iconCode = dayData.weather[0].icon;

            // Asegúrate de que el día no esté duplicado y hoy
            if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                uniqueDays.add(dayAbbreviation);
                daysList.innerHTML += `
                
                    <li>
                        <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                        <span>${dayAbbreviation}</span>
                        <span class="day-temp">${dayTemp}</span>
                    </li>

                `;
                count++;
            }

            // Detener después de 4 días distintos
            if (count === 4) break;
        }
    }).catch(error => {
        alert(`Error fetching weather data: ${error} (Api Error)`);
    });
}

// Obtener datos meteorológicos al cargar documentos para la ubicación predeterminada (Argentina)
//Esta función se ejecuta cuando el contenido HTML de la página se ha cargado completamente 
//(evento "DOMContentLoaded"). Su propósito es iniciar la obtención de datos climáticos para una 
//ubicación predeterminada, que en este caso está configurada como 'Argentina'
document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Argentina';
    fetchWeatherData(defaultLocation);
});

//Esta función escucha un clic en un botón. Luego, pide al usuario una ubicación y utiliza 
//esa ubicación para obtener datos climáticos y mostrarlos en la página.
locButton.addEventListener('click', () => {
    const location = prompt('Enter a location :');
    if (!location) return;

    fetchWeatherData(location);
});


//Funcion que cambia el fondo dependiendo de si es de dia o de noche
function setDayOrNightBackground() {
    const backgroundElement = document.querySelector('.background');
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 18) { // De 6:00 AM a 5:59 PM (día)
        backgroundElement.style.backgroundImage = 'url("images/day2.png")';
    } else { // De 6:00 PM a 5:59 AM (noche)
        backgroundElement.style.backgroundImage = 'url("images/night2.png")';
    }
}

// Llama a la función para configurar el fondo al cargar la página
setDayOrNightBackground();
