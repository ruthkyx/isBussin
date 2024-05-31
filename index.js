function saveUserInput(){
    let input = document.getElementById("userInputName").value;
    sessionStorage.setItem("userInputName", input); 
}
// this loads user input from session storage
function loadUserInput(){
    let input = sessionStorage.getItem("userInputName");
    if(input){
        document.getElementById("helloName").textContent = `Hello ${input}!`;
    }
}
let inputField = document.getElementById("userInputName"); // ref to input field
inputField.addEventListener("input", saveUserInput);

document.getElementById('submitNameBtn').onclick = function(){
    loadUserInput();
}
window.addEventListener("load", loadUserInput);

// bus arrival, bus services, bus routes, bus stops,

//   query string: ?BusStopCode=83139

function fetchData(){
  const busStopCode = document.getElementById('busStopNumber').value;
  const myHeaders = new Headers();
  myHeaders.append("AccountKey", API_KEY);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
      "timezone": "SGT",
      "adjustment": 100
  });

  const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
  };

  const url = new URL("http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2");
  url.searchParams.append("BusStopCode", busStopCode);

  fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
      const serviceNos = data.Services.map(service => service.ServiceNo);
      const serviceList = document.createElement("ul");
      serviceNos.forEach(serviceNo => {
        const li = document.createElement("li");
        li.textContent = serviceNo;
        serviceList.appendChild(li);
      })
      document.getElementById("serviceList").innerHTML = "";
      document.getElementById("serviceList").appendChild(serviceList);

      const busArrivalContainer = document.getElementById("busTime");
      busArrivalContainer.innerHTML = "";
      data.Services.forEach((service) => {
        const serviceNo = service.ServiceNo;
        const nextBusEstimatedArrival = service.NextBus.EstimatedArrival;
        const nextBus2EstimatedArrival = service.NextBus2.EstimatedArrival;
        const nextBus3EstimatedArrival = service.NextBus3.EstimatedArrival;

        const serviceHTML = `
          <h2>Service ${serviceNo}</h2>
          <p>Next Bus: ${nextBusEstimatedArrival}</p>
          <p>Next Bus 2: ${nextBus2EstimatedArrival}</p>
          <p>Next Bus 3: ${nextBus3EstimatedArrival}</p>
          <hr>
        `;
        const serviceElement = document.createElement("div");
        serviceElement.innerHTML = serviceHTML;
        busArrivalContainer.appendChild(serviceElement);
      });
    })
    .catch(error => console.log('error', error));
}

document.getElementById('busStopNumber').addEventListener('input', fetchData);



/*
function fetchData() {
  const busStopCode = document.getElementById("busStopNumber").value;
  const apiUrl = `https://cors-anywhere.herokuapp.com/corsdemo/http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      const serviceNos = data.Services.map((service) => service.ServiceNo);
      const serviceList = document.createElement("ul");

      serviceNos.forEach((serviceNo) => {
        const li = document.createElement("li");
        li.textContent = serviceNo;
        serviceList.appendChild(li);
      });

      document.getElementById("serviceList").innerHTML = "";
      document.getElementById("serviceList").appendChild(serviceList);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
} */

