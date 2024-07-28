// JavaScript code

let selectField = document.getElementById("selectField");
let selectText = document.getElementById("text-selected");
let citySelect = document.getElementById("city-list");

const governorates = {
  القاهرة: "Al Qāhirah",
  الجيزة: "Al Jīzah",
  الإسكندرية: "Al Iskandarīyah",
  الدقهلية: "Ad Daqahlīyah",
  البحيرة: "Al Buḩayrah",
  القليوبية: "Al Qalyūbīyah",
  المنوفية: "Al Minūfīyah",
  الغربية: "Al Gharbīyah",
  "كفر الشيخ": "Kafr ash Shaykh",
  الفيوم: "Al Fayyūm",
  "بني سويف": "Banī Suwayf",
  المنيا: "Al Minyā",
  أسيوط: "Asyūṭ",
  سوهاج: "Sūhāj",
  قنا: "Qinā",
  الأقصر: "Al Uqşur",
  أسوان: "Aswān",
  "البحر الأحمر": "Al Baḩr al Aḩmar",
  "الوادي الجديد": "Al Wādī al Jadīd",
  "مرسى مطروح": "Maţrūḩ",
  "شمال سيناء": "Shamāl Sīnā'",
  "جنوب سيناء": "Janūb Sīnā'",
  الإسماعيلية: "Al Ismā‘īlīyah",
  السويس: "As Suways",
  بورسعيد: "Būr Sa‘īd",
  دمياط: "Dumyāţ",
  الشرقية: "Ash Sharqīyah",
};

// Populate city select list
for (const [arabicName, englishName] of Object.entries(governorates)) {
  const option = document.createElement("li");
  option.classList.add(
    "text-lg",
    "sm:text-xl",
    "font-main",
    "my-2",
    "cursor-pointer",
    "hover:bg-[#0ba953]"
  );
  option.onclick = () => {
    selectText.innerHTML = option.innerHTML;
    selectField.value = option.innerHTML;
    citySelect.style.display = "none";
    document.getElementById("city-title").innerHTML = option.innerHTML;
    localStorage.setItem("selectedCity", option.innerHTML);
    localStorage.setItem("selectedCityEnglish", englishName);
    prayerTime(englishName);
  };

  option.value = arabicName;
  option.innerHTML = arabicName;
  citySelect.appendChild(option);
}

// Show city select list
selectField.onclick = function () {
  citySelect.style.display = "block";
};

// Hide the dropdown when clicking outside of it
document.addEventListener("click", function (event) {
  if (
    !selectField.contains(event.target) &&
    !citySelect.contains(event.target)
  ) {
    citySelect.style.display = "none";
  }
});

// Function to get and display the current date and time
function getDateTime() {
  const date = new Date();
  const dateElement = document.getElementById("date");
  const timeElement = document.getElementById("time");

  if (dateElement && timeElement) {
    dateElement.innerHTML =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    const time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    timeElement.innerHTML = convertTo12HourFormat(time);
  } else {
    console.error("Date or time elements not found in the DOM.");
  }
}

// Function to fetch prayer times based on city and month
function prayerTime(city) {
  const date = new Date();
  const currentMonth = date.getMonth() + 1; // Months are 0-indexed
  const currentYear = date.getFullYear();
  const currentDay = date.getDate();

  let url = `http://api.aladhan.com/v1/calendarByCity?city=${city}&country=EG&method=2&month=${currentMonth}&year=${currentYear}`;

  axios
    .get(url)
    .then((response) => {
      console.log("API Response:", response.data); // Debugging: Check the full response
      const data = response.data.data;
      const timings = data.find(
        (day) => parseInt(day.date.gregorian.day) === currentDay
      );

      if (timings) {
        const fajrElement = document.getElementById("fajr-time");
        const shoroukElement = document.getElementById("shorouk-time");
        const dhuhrElement = document.getElementById("dhuhr-time");
        const asrElement = document.getElementById("asr-time");
        const maghrebElement = document.getElementById("maghreb-time");
        const ishaElement = document.getElementById("isha-time");

        if (
          fajrElement &&
          shoroukElement &&
          dhuhrElement &&
          asrElement &&
          maghrebElement &&
          ishaElement
        ) {
          fajrElement.innerHTML = convertTo12HourFormat(timings.timings.Fajr);
          shoroukElement.innerHTML = convertTo12HourFormat(
            timings.timings.Sunrise
          );
          dhuhrElement.innerHTML = convertTo12HourFormat(timings.timings.Dhuhr);
          asrElement.innerHTML = convertTo12HourFormat(timings.timings.Asr);
          maghrebElement.innerHTML = convertTo12HourFormat(
            timings.timings.Maghrib
          );
          ishaElement.innerHTML = convertTo12HourFormat(timings.timings.Isha);
        } else {
          console.error("One or more timing elements not found in the DOM.");
        }
      } else {
        console.error("Timings not found for today. Data:", data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Function to convert time to 12-hour format
function convertTo12HourFormat(time) {
  const timeParts = time.split(" ");
  const [hour, minute] = timeParts[0].split(":");
  let period = "AM";
  let hour12 = parseInt(hour, 10);

  if (hour12 >= 12) {
    period = "PM";
    if (hour12 > 12) {
      hour12 -= 12;
    }
  } else if (hour12 === 0) {
    hour12 = 12;
  }

  return `${hour12}:${minute} ${period}`;
}

// Update date and time every second
setInterval(getDateTime, 1000);
getDateTime();

// Set default city and prayer times from localStorage
document.addEventListener("DOMContentLoaded", function () {
  const lastSelectedCity = localStorage.getItem("selectedCity");
  const lastSelectedCityEnglish = localStorage.getItem("selectedCityEnglish");

  if (lastSelectedCity) {
    selectText.innerHTML = lastSelectedCity;
    selectField.value = lastSelectedCity;
    document.getElementById("city-title").innerHTML = lastSelectedCity;
    citySelect.style.display = "none";

    if (lastSelectedCityEnglish) {
      prayerTime(lastSelectedCityEnglish);
    }
  } else {
    // Set default city to Cairo if no city is selected
    const defaultCity = "القاهرة"; // Arabic name for Cairo
    const defaultEnglishName = governorates[defaultCity]; // Get English name for Cairo
    selectText.innerHTML = defaultCity;
    selectField.value = defaultCity;
    document.getElementById("city-title").innerHTML = defaultCity;
    prayerTime(defaultEnglishName);
  }
});
