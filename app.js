// ==============================
// FIREBASE CONFIGURATION
// ==============================

const firebaseConfig = {
    databaseURL: "https://agermonere-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();


// ==============================
// LAST UPDATED TIME
// ==============================

function updateTime() {
    const now = new Date();
    document.getElementById("updateTime").innerHTML =
        "⏰ " + now.toLocaleTimeString();
}


// ==============================
// CHART
// ==============================

const ctx = document.getElementById("soilChart").getContext("2d");

const soilChart = new Chart(ctx, {

    type: "line",

    data: {

        labels: [],

        datasets: [{

            label: "Soil Moisture",

            data: [],

            borderColor: "#00ff99",

            backgroundColor: "rgba(0,255,150,0.2)",

            fill: true,

            tension: 0.4

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                labels: {

                    color: "white"

                }

            }

        },

        scales: {

            x: {

                ticks: {

                    color: "white"

                }

            },

            y: {

                ticks: {

                    color: "white"

                }

            }

        }

    }

});


// ==============================
// FIREBASE SENSOR DATA
// ==============================

db.ref("sensor").on("value", (snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    let soil = data.soil;
    let temp = data.temp;
    let hum = data.hum;
    let ph = data.ph;
    let light = data.light;

    document.getElementById("soil").innerHTML = soil;
    document.getElementById("temp").innerHTML = temp;
    document.getElementById("hum").innerHTML = hum;
    document.getElementById("ph").innerHTML = ph;
    document.getElementById("light").innerHTML = light;

    // Soil Status

    if (soil > 2600)
        document.getElementById("soilStatus").innerHTML = "Dry Soil";
    else
        document.getElementById("soilStatus").innerHTML = "Wet Soil";

    // Temperature Status

    if (temp > 35)
        document.getElementById("tempStatus").innerHTML = "High";
    else
        document.getElementById("tempStatus").innerHTML = "Normal";

    // Humidity Status

    if (hum > 80)
        document.getElementById("humStatus").innerHTML = "High";
    else if (hum < 40)
        document.getElementById("humStatus").innerHTML = "Low";
    else
        document.getElementById("humStatus").innerHTML = "Normal";

    // pH Status

    if (ph < 6.5)
        document.getElementById("phStatus").innerHTML = "Acidic";
    else if (ph <= 7.5)
        document.getElementById("phStatus").innerHTML = "Healthy";
    else
        document.getElementById("phStatus").innerHTML = "Alkaline";

    // Light Status

    if (light < 1000)
        document.getElementById("lightStatus").innerHTML = "Low";
    else
        document.getElementById("lightStatus").innerHTML = "Normal";

    // Update Graph

    soilChart.data.labels.push(new Date().toLocaleTimeString());

    soilChart.data.datasets[0].data.push(soil);

    if (soilChart.data.labels.length > 10) {

        soilChart.data.labels.shift();

        soilChart.data.datasets[0].data.shift();

    }

    soilChart.update();

    updateTime();

});


// ==============================
// AI DECISION
// ==============================

db.ref("ai").on("value", (snapshot) => {

    const ai = snapshot.val();

    if (!ai) return;

    document.getElementById("pumpDecision").innerHTML = ai.decision;

    if (ai.decision === "ON") {

        document.getElementById("pumpDecision").style.color = "#00ff66";

    } else {

        document.getElementById("pumpDecision").style.color = "#ff5252";

    }

});


// ==============================
// ALERTS
// ==============================

db.ref("alerts").on("value", (snapshot) => {

    const alert = snapshot.val();

    if (!alert) return;

    document.getElementById("heatAlert").innerHTML =
        alert.heat;

    document.getElementById("droughtRisk").innerHTML =
        alert.drought;

    document.getElementById("soilHealth").innerHTML =
        alert.soilHealth;

    document.getElementById("waterRisk").innerHTML =
        alert.waterRisk;

    document.getElementById("recommendation").innerHTML =
        alert.recommendation;

});


// ==============================
// WEATHER API
// ==============================

const apiKey = "YOUR_WEATHER_API_KEY";

const city = "Madurai";

fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)

.then(response => response.json())

.then(data => {

    document.getElementById("weatherCondition").innerHTML =
        data.current.condition.text;

    document.getElementById("weatherTemp").innerHTML =
        data.current.temp_c + " °C";

    document.getElementById("weatherHumidity").innerHTML =
        data.current.humidity + "%";

    document.getElementById("rainChance").innerHTML =
        data.current.precip_mm + " mm";

})

.catch(error => {

    console.log(error);

    document.getElementById("weatherCondition").innerHTML = "Unavailable";

});


// ==============================
// CONNECTION STATUS
// ==============================

document.getElementById("espStatus").innerHTML =
"📡 ESP32 : Connected";

document.getElementById("firebaseStatus").innerHTML =
"🔥 Firebase : Connected";

document.getElementById("aiStatus").innerHTML =
"🤖 AI Model : Online";