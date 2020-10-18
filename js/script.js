
window.onload = function(){
    //console.log("window loaded hahahaah!!");
    document.getElementById("submitZip").addEventListener('click', getWeather);
    document.getElementById("submitZip").addEventListener('click', getRest);
    document.getElementById("submitMovie").addEventListener('click', getMovie);
}

var lat;
var lon;
function getWeather(){
    //console.log("It is clicked!!!");
    document.getElementById('restaurants-container').style.display = "";
    document.getElementById('container').style.display = "";
    document.getElementById('movies-container').style.display = 'none';
    //console.log("button clicked");
    let zipcode = document.getElementById("zipcode").value;
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        //console.log("state has changed");
        if(xhttp.readyState === 4 && xhttp.status == 200){
            let weatherOBJ = JSON.parse(xhttp.responseText);
            //console.log(weatherOBJ);
            insertDataDOM(weatherOBJ);
        }
    }
    console.log(typeof config);
    xhttp.open("GET", `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${zipcode}`);
    xhttp.send();
}

function insertDataDOM(wObj){
    document.getElementById('container').style.visibility = 'visible';
    document.getElementById('cityName').innerText = wObj.location.name;
    document.getElementById('stateName').innerText = wObj.location.region;
    document.getElementById('localTime').innerText = wObj.location.localtime;
    document.getElementById('weatherImg').setAttribute("src", wObj.current.condition.icon);
    document.getElementById('degrees').innerText = wObj.current.temp_f + "° f";
    document.getElementById('conditionText').innerText = wObj.current.condition.text;
    document.getElementById('precipitation').innerText =  wObj.current.precip_in;
    document.getElementById('feelsLike').innerText = wObj.current.feelslike_f;
    document.getElementById('humidity').innerText = wObj.current.humidity;
    document.getElementById('windVelocity').innerText = wObj.current.wind_mph;
}

let counter2 = 0;
function getRest(){
    let zipcode = document.getElementById("zipcode").value;
    let xhttpW = new XMLHttpRequest();
    xhttpW.onreadystatechange = function(){
        if(xhttpW.readyState === 4 && xhttpW.status == 200){
            let weatherOBJ = JSON.parse(xhttpW.responseText);
            lat = parseFloat(weatherOBJ.location.lat);
            lon = parseFloat(weatherOBJ.location.lon);
            //console.log(lat);
            //console.log(lon);
        }
    }
    //console.log(zipcode);
    xhttpW.open("GET", `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${zipcode}`);
    xhttpW.send();

    setTimeout(function(){ 
        //console.log("rest api starts");
        document.getElementById('restaurants-container').style.display = '';
        document.getElementById('container').style.display = '';
        let xhttpR = new XMLHttpRequest();
        xhttpR.withCredentials = false;
        xhttpR.onreadystatechange = function(){
            if(xhttpR.readyState === 4 && xhttpR.status == 200){
                //console.log( lat + " and " + lon);
                let restOBJ = JSON.parse(xhttpR.responseText);
                //console.log(restOBJ);
                counter2++;
                createInsertDataDOM(restOBJ);
            }
        }  
        xhttpR.open("GET", `https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=30&currency=USD&distance=2&lunit=km&lang=en_US&latitude=${lat}&longitude=${lon}`);

        xhttpR.setRequestHeader("access-control-allow-credentials", "true");
        xhttpR.setRequestHeader("access-control-allow-headers", "ver");
        xhttpR.setRequestHeader("access-control-allow-origin", "http://127.0.0.1:5501/html/index.html");
        xhttpR.setRequestHeader("x-rapidapi-host", "tripadvisor1.p.rapidapi.com");
        xhttpR.setRequestHeader("x-rapidapi-key", tripadvisorApiKey);
        xhttpR.send();
    }, 1000);
}

function createInsertDataDOM(restObj){
    let restContainer = document.getElementById("restaurants-container");
    if(counter2>1){
        while (restContainer.firstChild) {
            restContainer.removeChild(restContainer.firstChild);
        }
    }
    let counterToTen = 0;
    for (let i = 0; i < restObj.data.length; i++){
        if (restObj.data[i].name){
            let newDiv = document.createElement('div');
            newDiv.id = "rest" + i;
            newDiv.title = "Restaurants";
            restContainer.appendChild(newDiv);
            //let webImg = restObj.data[i].photo.images.small.url;
            if(restObj.data[i].photo){
                let newImage = document.createElement('img');
                newImage.id = "restImg";
                newImage.src = restObj.data[i].photo.images.small.url;
                newDiv.appendChild(newImage);
            } else { 
                let newImage = document.createElement('img');
                newImage.id = "restImg";
                newImage.src = "./resources/noimage.png";
                newDiv.appendChild(newImage);
            };
            let newH2Name = document.createElement('h2');
            newH2Name.id = "restName";
            newH2Name.textContent = restObj.data[i].name;
            newDiv.appendChild(newH2Name);
            let newH3Address = document.createElement('h3');
            newH3Address.id = "rest1-name";
            newH3Address.textContent = restObj.data[i].address;
            newDiv.appendChild(newH3Address);
            counterToTen++;
        }
        if(counterToTen===12){
            break;
        }
    }
}
 
let counter = 0;
function getMovie(){
    document.getElementById('movies-container').style.display = '';
    document.getElementById('restaurants-container').style.display = 'none';
    document.getElementById('container').style.display = 'none';
    let movie = document.getElementById('movie').value;
    let xhttpM = new XMLHttpRequest();

    xhttpM.onreadystatechange = function(){
        if(xhttpM.readyState === 4 && xhttpM.status == 200){
            let movieOBJ = JSON.parse(xhttpM.responseText);
            //console.log(movieOBJ);
            counter++;
            insertMovieDOM(movieOBJ);
        }
    }
    xhttpM.open("GET", `https://imdb8.p.rapidapi.com/title/find?q=${movie}`);
    xhttpM.setRequestHeader("x-rapidapi-host", "imdb8.p.rapidapi.com");
    xhttpM.setRequestHeader("x-rapidapi-key", tripadvisorApiKey);
    xhttpM.send();
}

function insertMovieDOM(movieObj){
    let restContainer = document.getElementById("movies-container");
    if(counter>1){
        while (restContainer.firstChild) {
            restContainer.removeChild(restContainer.firstChild);
        }
    }
   
    for (let i = 0; i < movieObj.results.length; i++){
        let newDiv = document.createElement('div');
        newDiv.id = "movies"+i;
        newDiv.title = "Movies";
        restContainer.appendChild(newDiv);

        let newH2Title = document.createElement('h2');
        newH2Title.id = "movieTitle";
        newH2Title.textContent = movieObj.results[i].title;
        newDiv.appendChild(newH2Title);

        let newImg = document.createElement('img');
        newImg.id = "movieImg";
        newImg.setAttribute('src', movieObj.results[i].image.url + movieObj.results[i].image.id);
        newDiv.appendChild(newImg);
        
        let newH2Year = document.createElement('h2');
        newH2Year.id = "year";
        newH2Year.textContent = "Year: " + movieObj.results[i].year;
        newDiv.appendChild(newH2Year);

        if(i===9){
            break;
        }

        //console.log(newH2Title);
        //console.log(newH2Title.textContent);
        if(newH2Title.textContent === ""){
            document.querySelector('#movies' + i).remove();
        }
    }
}
