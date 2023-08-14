import { format, isToday } from "date-fns";
import { previousDay } from "./fetching";

function topLeftDisplay(today, temp) {
  // Clearing the error message
  document.querySelector(".error").textContent = "";

  const weatherCondition = document.querySelector(".weather-condition-heading");
  const placeHeading = document.querySelector(".place-heading");
  const dateHeading = document.querySelector(".date-heading");
  const timeHeading = document.querySelector(".time-heading");
  const temperatureHeading = document.querySelector(".temperature-heading");
  const temperatureIcon = document.querySelector("#temperature-icon");
  const degree = temp === "f" ? today.current.temp_f : today.current.temp_c;

  weatherCondition.textContent = today.current.condition.text;
  placeHeading.textContent = today.location.name;

  // formatting (Day , 01th Mon 21)
  dateHeading.textContent = format(
    new Date(today.location.localtime.split(" ")[0]),
    "EEEE, do MMM yy"
  );

  timeHeading.textContent = today.location.localtime.split(" ")[1];
  // Checking whether need to display T or C
  temperatureHeading.innerHTML = `${degree} &deg${temp.toUpperCase()}`;

  // Displaying default icon as a backup from API
  temperatureIcon.src = today.current.condition.icon;
  iconChanger(today, temperatureIcon); // Displaying custom ICON
}

function topRightDisplay(today, temp) {
  const timedata = today.location.localtime.split(" ")[1].split(":")[0]; // [00]:00
  const currentHour = today.forecast.forecastday[0].hour[timedata];

  const feelsLike = document.querySelector(".feels-like");
  const humidity = document.querySelector(".humidity");
  const chanceOfRain = document.querySelector(".cor");
  const windSpeed = document.querySelector(".wind");

  //   Checking whether need to display f or c.
  const degree =
    temp === "f" ? currentHour.feelslike_f : currentHour.feelslike_c;

  feelsLike.innerHTML = `${degree} &deg;${temp.toUpperCase()}`;
  humidity.textContent = `${currentHour.humidity}%`;
  chanceOfRain.textContent = `${currentHour.chance_of_rain} %`;
  windSpeed.textContent = `${currentHour.wind_kph} km/h`;
}

function iconChanger(data, ele) {
  // if data.current is undefined then data.day (for multiple use cases)
  let value = data.current === undefined ? data.day : data.current;
  const datavalue = value;
  const element = ele;

  //   weather value into lowercases
  value = value.condition.text.toLowerCase();

  if (value.includes("rain") || value.includes("drizzle")) {
    element.src = "./SVG/rainy.svg";
  }

  if (value.includes("mist")) {
    element.src = "./SVG/mist.svg";
  }

  if (value.includes("snow")) {
    element.src = "./SVG/snow.svg";
  }

  if (value.includes("sunny")) {
    element.src = "./SVG/sun.svg";
  }

  if (value === "partly cloudy") {
    if (datavalue.is_day === 1) {
      element.src = "./SVG/cloudy-day.svg";
    } else {
      element.src = "./SVG/cloudy-night.svg";
    }
  } else if (value.includes("clouds") || value.includes("cloudy")) {
    element.src = "./SVG/cloudy.svg";
  }

  if (value.includes("Overcast")) {
    element.src = "./SVG/cloud.svg";
  }

  if (value === "clear") {
    if (datavalue.is_day === 1) {
      element.src = "./SVG/sun.svg";
    } else {
      element.src = "./SVG/moon.svg";
    }
  }
}

function bottomDisplayItem(value, temp) {
  const bottomContainer = document.querySelector(".bottom-container");
  const bottomItemContainer = document.createElement("div");
  const degreeContainer = document.createElement("div");
  const bottomHeading = document.createElement("h3");
  const bottomTemp = document.createElement("h2");
  const bottomFeelLike = document.createElement("p");
  const bottomIcon = document.createElement("img");

  bottomHeading.className = "bottom-heading";
  bottomTemp.className = "bottom-temp";
  bottomFeelLike.className = "bottom-feel-like";
  bottomIcon.className = "bottom-icon";

  const date = format(new Date(value.date), "EEEE");
  bottomHeading.textContent = isToday(new Date(value.date)) ? "Today" : date;

  const degreemax = temp === "f" ? value.day.maxtemp_f : value.day.maxtemp_c;
  const degreeavg = temp === "f" ? value.day.avgtemp_f : value.day.avgtemp_c;

  bottomTemp.innerHTML = `${degreemax} &deg;${temp.toUpperCase()}`;
  bottomFeelLike.innerHTML = `${degreeavg} &deg;${temp.toUpperCase()}`;

  bottomIcon.src = value.day.condition.icon;

  iconChanger(value, bottomIcon);

  degreeContainer.append(bottomTemp, bottomFeelLike);
  bottomItemContainer.append(bottomHeading, degreeContainer, bottomIcon);
  bottomContainer.appendChild(bottomItemContainer);
}

function bottomDisplay(today, temp) {
  // Emptying the container each time the bottom display calls
  document.querySelector(".bottom-container").textContent = "";

  //   It's a chaining..for getting the weather for 2 previous days.
  previousDay(2, temp, bottomDisplayItem).then(() => {
    previousDay(1, temp, bottomDisplayItem).then(() => {
      // After getting the values , now for next 3 days
      today.forecast.forecastday.forEach((day) => {
        bottomDisplayItem(day, temp);
      });
    });
  });
}

export { topLeftDisplay, topRightDisplay, bottomDisplay };
