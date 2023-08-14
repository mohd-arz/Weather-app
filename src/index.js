import { format, isToday } from "date-fns";
import fetchingToday, { previousDay } from "./fetching";
import { topLeftDisplay, topRightDisplay, bottomDisplay } from "./display";
import "./style.css";

// Setting default place to nagercoil and temperature to f
let place = "nagercoil";
let temperature = "f";

// fetching the data by input field
function fetchingByInput() {
  const input = document.querySelector("input");
  if (input.value !== "") {
    fetchingToday(input.value)
      .then((data) => {
        place = input.value;
        topLeftDisplay(data, temperature);
        topRightDisplay(data, temperature);
        bottomDisplay(data, temperature);
        input.value = "";
      })
      .catch(() => {
        const errorMessage = document.querySelector(".error");
        errorMessage.textContent = "No Location Found";
      });
  }
}

// fetching the data by stored value
function fetchingByStoredValue() {
  fetchingToday(place).then((data) => {
    topLeftDisplay(data, temperature);
    topRightDisplay(data, temperature);
    bottomDisplay(data, temperature);
  });
}

// Starts fetch when hits Enter
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchingByInput();
  }
});

// Starts fetch when hits the search icon
const search = document.querySelector(".search");
search.addEventListener("click", () => {
  fetchingByInput();
});

// Toggle the temperature and fetch according to that value.
const tempToggle = document.querySelector(".temperature-toggle");
tempToggle.addEventListener("click", () => {
  if (tempToggle.id === "f") {
    tempToggle.innerHTML = "Display &deg;F";
    tempToggle.id = "c";
    temperature = "c";
    fetchingByStoredValue();
  } else {
    tempToggle.innerHTML = "Display &deg;C";
    tempToggle.id = "f";
    temperature = "f";
    fetchingByStoredValue();
  }
});

// for startup
fetchingByStoredValue();

export default place;

// Everything in below shifted to their own Modules.

// async function fetchingToday(place) {
//   try {
//     const response = await fetch(
//       `https://api.weatherapi.com/v1/forecast.json?key=d9d248dde9504c5d84242842231208&days=3&q=${place}`,
//       { mode: "cors" }
//     );
//     const today = await response.json();
//     if (
//       today.error !== undefined &&
//       today.error.message === "No matching location found."
//     ) {
//       return Promise.reject(today.error.message);
//     }
//     return today;
//   } catch (err) {
//     return err;
//   }
// }

// function topLeftDisplay(today, temp) {
//   document.querySelector(".error").textContent = "";
//   const weatherCondition = document.querySelector(".weather-condition-heading");
//   weatherCondition.textContent = today.current.condition.text;

//   const placeHeading = document.querySelector(".place-heading");
//   placeHeading.textContent = today.location.name;
//   const dateHeading = document.querySelector(".date-heading");
//   const timeHeading = document.querySelector(".time-heading");
//   dateHeading.textContent = format(
//     new Date(today.location.localtime.split(" ")[0]),
//     "EEEE, do MMM yy"
//   );
//   // eslint-disable-next-line prefer-destructuring
//   timeHeading.textContent = today.location.localtime.split(" ")[1];

//   const temperatureHeading = document.querySelector(".temperature-heading");

//   const degree = temp === "f" ? today.current.temp_f : today.current.temp_c;
//   temperatureHeading.innerHTML = `${degree} &deg${temp.toUpperCase()}`;
//   //   temperatureHeading.innerHTML = `${today.current.temp_f} &degF`;

//   const temperatureIcon = document.querySelector("#temperature-icon");
//   temperatureIcon.src = today.current.condition.icon;

//   iconChanger(today, temperatureIcon);
// }

// function topRightDisplay(today, temp) {
//   const timedata = today.location.localtime.split(" ")[1].split(":")[0];
//   const currentHour = today.forecast.forecastday[0].hour[timedata];

//   const feelsLike = document.querySelector(".feels-like");
//   const humidity = document.querySelector(".humidity");
//   const chanceOfRain = document.querySelector(".cor");
//   const windSpeed = document.querySelector(".wind");

//   const degree =
//     temp === "f" ? currentHour.feelslike_f : currentHour.feelslike_c;

//   feelsLike.innerHTML = `${degree} &deg;${temp.toUpperCase()}`;
//   humidity.textContent = `${currentHour.humidity}%`;
//   chanceOfRain.textContent = `${currentHour.chance_of_rain} %`;
//   windSpeed.textContent = `${currentHour.wind_kph} km/h`;
// }

// function iconChanger(data, ele) {
//   let value = data.current === undefined ? data.day : data.current;
//   const datavalue = value;
//   const element = ele;

//   value = value.condition.text.toLowerCase();

//   if (value.includes("rain") || value.includes("drizzle")) {
//     element.src = "./SVG/rainy.svg";
//   }
//   if (value.includes("mist")) {
//     element.src = "./SVG/mist.svg";
//   }
//   if (value.includes("snow")) {
//     element.src = "./SVG/snow.svg";
//   }
//   if (value.includes("sunny")) {
//     element.src = "./SVG/sun.svg";
//   }
//   if (value === "partly cloudy") {
//     if (datavalue.is_day === 1) {
//       element.src = "./SVG/cloudy-day.svg";
//     } else {
//       element.src = "./SVG/cloudy-night.svg";
//     }
//   } else if (value.includes("clouds") || value.includes("cloudy")) {
//     element.src = "./SVG/cloudy.svg";
//   }
//   if (value.includes("Overcast")) {
//     element.src = "./SVG/cloud.svg";
//   }
//   if (value === "clear") {
//     if (datavalue.is_day === 1) {
//       element.src = "./SVG/sun.svg";
//     } else {
//       element.src = "./SVG/moon.svg";
//     }
//   }
// }

// function bottomDisplayItem(value, temp) {
//   const bottomContainer = document.querySelector(".bottom-container");
//   const bottomItemContainer = document.createElement("div");
//   const bottomHeading = document.createElement("h3");
//   const bottomTemp = document.createElement("h2");
//   const bottomFeelLike = document.createElement("p");
//   const bottomIcon = document.createElement("img");

//   bottomHeading.className = "bottom-heading";
//   bottomTemp.className = "bottom-temp";
//   bottomFeelLike.className = "bottom-feel-like";
//   bottomIcon.className = "bottom-icon";

//   const date = format(new Date(value.date), "EEEE");
//   bottomHeading.textContent = isToday(new Date(value.date)) ? "Today" : date;

//   const degreemax = temp === "f" ? value.day.maxtemp_f : value.day.maxtemp_c;
//   const degreeavg = temp === "f" ? value.day.avgtemp_f : value.day.avgtemp_c;

//   bottomTemp.innerHTML = `${degreemax} &deg;${temp.toUpperCase()}`;
//   bottomFeelLike.innerHTML = `${degreeavg} &deg;${temp.toUpperCase()}`;

//   bottomIcon.src = value.day.condition.icon;

//   iconChanger(value, bottomIcon);

//   bottomItemContainer.append(
//     bottomHeading,
//     bottomTemp,
//     bottomFeelLike,
//     bottomIcon
//   );
//   bottomContainer.appendChild(bottomItemContainer);
// }

// function bottomDisplay(today, temp) {
//   document.querySelector(".bottom-container").textContent = "";
//   previousDay(2, temp, bottomDisplayItem).then(() => {
//     previousDay(1, temp, bottomDisplayItem).then(() => {
//       today.forecast.forecastday.forEach((day) => {
//         bottomDisplayItem(day, temp);
//       });
//     });
//   });
// }
// async function previousDay(day, temp, callback) {
//   let date = new Date();
//   date.setDate(date.getDate() - day);
//   date = format(new Date(date), "yyyy-MM-dd");
//   const response = await fetch(
//     `https://api.weatherapi.com/v1/history.json?key=d9d248dde9504c5d84242842231208&q=${place}&dt=${date}`
//   );
//   const data = await response.json();
//   callback(data.forecast.forecastday[0], temp);
// }

// fetchingToday(place).then((data) => {
//   topLeftDisplay(data, "f");
//   topRightDisplay(data, "f");
//   bottomDisplay(data, "f");
// });
