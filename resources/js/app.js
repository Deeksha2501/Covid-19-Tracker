const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");
const loader = document.querySelector('.loader');

const ctx = document.getElementById("axes_line_chart").getContext("2d");
const ctx1 = document.querySelector("#axes_line_chart")

let app_data = [],
  cases_list = [],
  recovered_list = [],
  deaths_list = [],
  dates = [],
  country_code,
  user_country;


country_code = "IN";

country_list.forEach((country) => {
  if (country.code == country_code) {
    user_country = country.name;
  }
});

function fetchData(user_country) {
	country_name_element.innerHTML = "Please Wait...";
    ctx1.style.display = "none";
    loader.style.display = "inline";
    app_data = [];
    cases_list = [];
    recovered_list = [];
    deaths_list = [];
    dates = [];
  fetch(
    `https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_particular_country.php?country=${user_country}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
        "x-rapidapi-key": "8ffb8fbfaamsh270e8bcd068252ep1dc17djsn065a8f049ef5",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let extracted_data = [];
      const extract_data = data.stat_by_country;
      let prev_date = 0;
      extract_data.forEach((data_by_date) => {
        if (getDate(data_by_date.record_date) !== prev_date) {
        //   console.log(data_by_date);
          extracted_data.push(data_by_date);
          prev_date = getDate(data_by_date.record_date);
        }
      });
      extracted_data = extracted_data.reverse();
      console.log(extracted_data);
      extracted_data.forEach((DATA)=>{
          app_data.push(DATA);
        dates.push(formatDate(getDate(DATA.record_date)));
        cases_list.push(parseInt(DATA.total_cases.replace(/,/g, "")));
	    recovered_list.push(parseInt(DATA.total_recovered.replace(/,/g, "")));
		deaths_list.push(parseInt(DATA.total_deaths.replace(/,/g, "")));
      })
    })
    .then(()=>{
        updateUI();
    })
    .catch((err) => {
      console.log(err);
    //   alert("Oops! An Error occurred....Sorry for the inconvinience. Please contact the developer for this site if you want to acknowledge her about the error. It would be a great help!")
    });
}



fetchData(user_country);

function getDate(date){
    return date.split(" ")[0];
}

const monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateString){

	let date = new Date(dateString);
	return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}

function updateUI(){
    updateStats();
    loader.style.display = "none"
    axesLinearChart();
}

function updateStats(){
    let last_entry = app_data[app_data.length - 1];
    let before_last_entry = app_data[app_data.length - 2];

    country_name_element.innerHTML = last_entry.country_name;
    total_cases_element.innerHTML = last_entry.total_cases || 0;
	new_cases_element.innerHTML = `+${last_entry.new_cases || 0 }`;

	recovered_element.innerHTML = last_entry.total_recovered || 0;
	new_recovered_element.innerHTML = `+${parseInt(last_entry.total_recovered.replace(/,/g, "")) - parseInt(before_last_entry.total_recovered.replace(/,/g, ""))}`;
	
	deaths_element.innerHTML = last_entry.total_deaths;
	new_deaths_element.innerHTML = `+${last_entry.new_deaths || 0}`;


    console.log(last_entry);
}


//update chart
let my_chart;
function axesLinearChart(){
    if(my_chart){
        my_chart.destroy();
    }
    // chart.classList.remove = 'hide';
    ctx1.style.display = "block";
    my_chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Cases',
                data: cases_list,
                borderColor : '#fff',
                backgroundColor : '#fff',
                fill : false,
                borderWidth : 1,
                pointRadius : 2,
            } , 
            {
                label: 'Recovered',
                data: recovered_list,
                borderColor : '#009688',
                backgroundColor : '#009688',
                fill : false,
                borderWidth : 1,
                pointRadius : 2,
            } ,
            {
                label: 'Deaths',
                data: deaths_list,
                borderColor : '#f44336',
                backgroundColor : '#f44336',
                fill : false,
                borderWidth : 1,
                pointRadius : 2,
            }],
            labels: dates
        },
        options: {
            responsive : true,
            maintainAspectRatio : false
        }
       
    });
}