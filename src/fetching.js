import { format } from "date-fns";
import place from ".";

// fetching Today and the place where it's been called.
async function fetchingToday(place) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=d9d248dde9504c5d84242842231208&days=3&q=${place}`,
      { mode: "cors" }
    );
    const today = await response.json();
    if (
      today.error !== undefined &&
      today.error.message === "No matching location found."
    ) {
      return Promise.reject(today.error.message);
    }
    return today;
  } catch (err) {
    return err;
  }
}

// Fetching previous day whether it's one day prior or two depending from the call.
async function previousDay(day, temp, callback) {
  let date = new Date();
  date.setDate(date.getDate() - day);
  date = format(new Date(date), "yyyy-MM-dd");
  const response = await fetch(
    `https://api.weatherapi.com/v1/history.json?key=d9d248dde9504c5d84242842231208&q=${place}&dt=${date}`
  );
  const data = await response.json();
  callback(data.forecast.forecastday[0], temp);
}

export default fetchingToday;
export { previousDay };
