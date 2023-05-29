//I send api to server and get array of 100 coin
const listCoins = [];
$(document).ready(function () {
  $("#about").hide();
  let fetchRes = fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc"
  );
  fetchRes
    .then((res) => res.json())
    .then((data) => {
      createCard(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // create a new card for any coin and show this above html dom

  function createCard(data) {
    $("#about").hide();
    data.forEach((coin) => {
      const card = ($("<div></div>").html = `
     <div class="card" ,"row" ,"col-4" style="width: 195px; height:250px; "> 
     <div class="form-check form-switch">
     <input class="form-check-input" type="checkbox" role="switch" id="switch${coin.id}">
     <label class="form-check-label" for="flexSwitchCheckDefault"></label>
     </div>
     <p class="card-text" id="symbolText">${coin.symbol}</p>
     <h5 class="card-title" id="nameText">${coin.name}</h5>
     <img src="${coin.image}" class="card-img-top" style="width:85px; ">
        <div class="card-body">
          <button  class="btn btn-primary , btn" id="moreBtn_${coin.id}" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample_${coin.id}" aria-expanded="false" aria-controls="collapseExample">
            More Info</button>
        </p>
        <div class="spinner-border" role="status" id="spinner_${coin.id}">
      <span class="visually-hidden">Loading...</span>
      </div>
        <div class="collapse" id="collapseExample_${coin.id}">
          <div class="card card-body" id="moreInfoText_${coin.id}">
          </div>
        </div>`);
      $("#root").append(card);

      // click on button and call the function getDetails more information api

      $(`#moreBtn_${coin.id}`).on("click", function () {
        getDetails(coin.id);
      });

      // click on button and close the collapse

      $(`#moreBtn_${coin.id}`).off("click", function () {
        $(`#spinner_${coin.id}`).hide();
      });

      // click on button and call the function addCoin toggle
      $(`#switch${coin.id}`).on('click' , function (){
        if(document.getElementById(`switch${coin.id}`).checked){
             if(listCoins.length < 5){
             listCoins.push(coin);
           } else{
             showModal(coin) , 
             switchOff(coin.id)}
       }else{
         removeCoinFromArray(coin)
       }
     })
         //click on modal and remove one of coin from list 
     $(document).on("click", `#switch_modal${coin.symbol}` , function() {
      if(document.getElementById(`switch_modal${coin.symbol}`).checked) {
          switchOn(`#switch_modal${coin.id}`)
          arr.push(`${coin}`)
      } else {
        removeCoinFromArray(coin);
          switchOff(coin.id)
      }  
  })

     function switchOff(id){
      $(`#switch${coin.id}`).prop("checked", false); 
      
    }

    function switchOn (id){
      $(`#switch${coin.id}`).prop("checked", true); 
  
  }
      
      //click on button and call the function searchCoin

      $("#searchBtn").on("click", function () {
        searchCoin(data);
      });

      // send api number 2 to server and get details for each currency and save that un cache

      const coinsCache = [];

       function getDetails(id) {
         $(`#spinner_${coin.id}`).show();
         if (coinsCache[id]) {
           createDetails(data);
         } else {
           const url = (`https://api.coingecko.com/api/v3/coins/${id}`);
           fetch(url)
            .then((res) => res.json())
             .then((data) => {
              $(`#spinner_${coin.id}`).hide();
             createDetails(data, id);
              coinsCache[id] = data;
              $(`#spinner_${coin.id}`).hide();
              console.log(coinsCache);
              setTimeout(() => {
                 delete coinsCache[id];
              }, 1000 * 60 * 2);
             console.log(coinsCache);
             $(`#spinner_${coin.id}`).hide();
             })
             .catch((error) => {
              console.error("Error:", error);
             });
         }
       }

      // create details

      function createDetails(data) {
        console.log(data);
        const details = ($("<div></div>").html = `
        <ul>
        <li> USD:${data.market_data.current_price.usd} &#36</li>
        <li> EUR:${data.market_data.current_price.eur} &#x20AC;</li>
        <li> ILS:${data.market_data.current_price.ils} &#x20AA</li>
        </ul>
        `);
        $(`#moreInfoText_${coin.id}`).append(details);
        return details;
      }
    });
  }

  // search a coin the user entered

  function searchCoin(data) {
    const search = document.getElementById("inputSearch");
    const value = search.value;
    const foundCoin = data.find((c) => c.symbol === value);
    if (foundCoin) {
      createFoundCoin(foundCoin);
    } else {
      console.log("this coin is not founded !!");
    }
    return foundCoin;
  }

  // show the foundCoin above html dom

  function createFoundCoin(foundCoin) {
    $("#root").hide();
    const cardFound = `
     <div class="card" ,"row" ,"col-4" style="width: 250px; "> 
     <div class="form-check form-switch">
     <input class="form-check-input" type="checkbox" role="switch" id="click_toggle${foundCoin.id}">
     <label class="form-check-label" for="flexSwitchCheckDefault"></label>
     </div>
     <p class="card-text">${foundCoin.symbol}</p>
     <h5 class="card-title">${foundCoin.name}</h5>
     <img src="${foundCoin.image}" class="card-img-top" style="width:95px;">
        <div class="card-body">
          <button  class="btn btn-primary" id="moreBtn_${foundCoin.id}" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample_${foundCoin.id}" aria-expanded="false" aria-controls="collapseExample">
            More Info</button>
        </p>
        <div class="spinner-border" role="status" id="spinner_${foundCoin.id}">
      <span class="visually-hidden">Loading...</span>
      </div>
        <div class="collapse" id="collapseExample_${foundCoin.id}">
          <div class="card card-body" id="moreInfoText_${foundCoin.id}">
          </div>
        </div>`;
    $("#contact").html(cardFound).show();


    $(`#moreBtn_${foundCoin.id}`).on("click", function () {
      getDetailsFound(foundCoin.id);
    });
  }
  function getDetailsFound(id) {
    console.log(foundCoin.id);
    fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then((res) => res.json())
      .then((data) => {
        createDetailsFound(data, id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function createDetailsFound(data) {
    console.log(data);
    const detailsFound = ($("<div></div>").html = `
    <ul>
    <li> USD:${data.market_data.current_price.usd} &#36</li>
    <li> EUR:${data.market_data.current_price.eur} &#x20AC;</li>
    <li> ILS:${data.market_data.current_price.ils} &#x20AA</li>
    </ul>
    `);
    $(`#moreInfoText_${foundCoin.id}`).append(detailsFound);
  }


  // to add checked button to array and not over than 5 coin
  
function  removeCoinFromArray(coin){
  const index = listCoins.indexOf(coin);
  if (index > -1) {
    listCoins.splice(index, 1);
  }
  console.log(listCoins);
}
  
  // modal about select 5 coins

  function showModal(coin) {
    for (let index = 0; index < listCoins.length; index++) {
      modal.style.display = "block";
      const semiModal = `
      <p> If you want to add a ${coin.symbol}  you have to remove one of them </p>
          <div class="card" style="width: 7rem; background-color: peachpuff;">
            <div class="card-body">
              <h5 class="card-title">${listCoins[0].symbol}</h5>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="switch_modal${listCoins[0].symbol}" checked>
                <label class="form-check-label" for="flexSwitchCheckDefault"></label>
              </div>
            </div>
          </div>
          <div class="card" style="width: 7rem; background-color: peachpuff;">
            <div class="card-body">
              <h5 class="card-title">${listCoins[1].symbol}</h5>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="switch_modal${listCoins[1].symbol}" checked>
                <label class="form-check-label" for="flexSwitchCheckDefault"></label>
              </div>
            </div>
          </div>
          <div class="card" style="width: 7rem; background-color: peachpuff;">
            <div class="card-body">
              <h5 class="card-title">${listCoins[2].symbol}</h5>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="switch_modal${listCoins[2].symbol}" checked>
                <label class="form-check-label" for="flexSwitchCheckDefault"></label>
              </div>
            </div>
          </div>
          <div class="card" style="width: 7rem; background-color: peachpuff;">
            <div class="card-body">
              <h5 class="card-title">${listCoins[3].symbol}</h5>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="switch_modal${listCoins[3].symbol}" checked>
                <label class="form-check-label" for="flexSwitchCheckDefault"></label>
              </div>
            </div>
          </div>
          <div class="card" style="width: 7rem; background-color: peachpuff;">
            <div class="card-body">
              <h5 class="card-title">${listCoins[4].symbol}</h5>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="switch_modal${listCoins[4].symbol}" checked >
                <label class="form-check-label" for="flexSwitchCheckDefault"></label>
              </div>
            </div>
          </div>

          `;
      $("#modalBody").html(semiModal);
    }
  }

// Get the modal
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

//Get the close button 
const close = document.getElementById("btnClose");

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};

// When the user clicks on btn close , close the modal
close.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

 $("#btnSave").click(function (){
  modal.style.display = "none";
 
 })

// click on button and show home

  $("#homeBtn").click(function () {
    $("#root").show();
    $("#contact").hide();
    $("#myModal").hide();
  });

// click on button and show about

  $("#aboutBtn").click(function () {
    showAbout();
  });

  // show information about me and project

  function showAbout() {
    $("#root").hide();
    $("#contact").hide();
    $("#myModal").hide();
    const bodyAbout = `
    <div class="container">
    <br>
    <h2>about my self</h2>
    <br>
    <p> My name is Batya Yerushalmi <br>
    I live in Ganei-Tikva <br>
    And I work in an accounting office as a tax consultant <br></p>
    <h3>My hobbies:</h3>
    <ul>
    <li>Read books.</li>
    <li>Bake.</li>
    <li>Go for a walk.</li>
    </ul>
    <h2>about my project </h2>
    <br>
    <p>The project presented to you is a project dealing with virtual currencies.<br>
    This market of virtual currencies has become very popular.<br>
    On the home page of the project, all types of coins appear.<br>
    Each card contains a picture of the coin and its name. <br>
    by pressing a button Additional information , <br>
    You can get reliable information about the value of currencies in shekels, euros, and dollars.<br>
    To make it easier, it is possible to search for a specific type of currency
    in the search box.
    <p>Enjoy using my project!</p>
    <br>
    <br>
    <br>
    </div>
    `;
    $("#about").append(bodyAbout).show();
  }
});
