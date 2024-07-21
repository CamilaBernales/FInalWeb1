document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  fetch("place.json")
    .then((response) => response.json())
    .then((data) => {
      renderHome(data);
    });

  function renderHome(cities) {
    app.innerHTML = `
      <div class="cards-container">
        ${cities
          .map(
            (city) => `
          <div class="card">
            <img src="${city.img}" alt="${city.city}">
            <div class="card-content">
              <div class="card-title">${city.city}</div>
              <div class="card-price">desde $${city.price}</div>
              <div class="card-description">${city.desc}</div>
              <button onclick="selectCity(${city.id})">Ver más</button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  window.selectCity = function (cityId) {
    fetch("place.json")
      .then((response) => response.json())
      .then((data) => {
        const city = data.find((c) => c.id === cityId);
        renderDetails(city);
      });
  };

  function renderDetails(city) {
    app.innerHTML = `
      <div class="details-container active">
        <img src="${city.img}" alt="${city.city}">
        <div class="details-content">
          <h2>${city.city}</h2>
          <p>${city.desc}</p>
          <div class="options-picker">
            <div>
                <label for="hotel">Hoteles</label>
                <select id="hotel">
                ${city.hotels
                  .map(
                    (hotel) => `
                    <option value="${hotel.price}">${hotel.name} - $${hotel.price}</option>
                `
                  )
                  .join("")}
                </select>
            </div>
            <div>
                <label for="guests">Huéspedes</label>
                <input type="number" id="guests" value="1" min="1">
            </div>
            <div>
                <label for="days">Días</label>
                <input type="number" id="days" value="1" min="1">
            </div>
            <div id="total">Total: $${city.price}</div>
          </div>
          <div id="error-message" style="color: red;"></div>
          <button class="details-button" onclick="goToSummary('${city.city}', ${
      city.price
    })">Viajar!</button>
        </div>
      </div>
    `;

    const hotelSelect = document.getElementById("hotel");
    const guestsInput = document.getElementById("guests");
    const daysInput = document.getElementById("days");
    const totalDiv = document.getElementById("total");

    [hotelSelect, guestsInput, daysInput].forEach((input) => {
      input.addEventListener("change", updateTotal);
    });

    function updateTotal() {
      const hotelPrice = parseInt(hotelSelect.value);
      const guests = parseInt(guestsInput.value);
      const days = parseInt(daysInput.value);
      const total = city.price + hotelPrice * guests * days;
      totalDiv.innerText = `Total: $${total}`;
    }
  }

  window.goToSummary = function (cityName, basePrice) {
    fetch("place.json")
      .then((response) => response.json())
      .then((data) => {
        const city = data.find((c) => c.city === cityName);
        const hotelSelect = document.getElementById("hotel");
        const guestsInput = document.getElementById("guests");
        const daysInput = document.getElementById("days");
        const hotelPrice = parseInt(hotelSelect.value);
        const guests = parseInt(guestsInput.value);
        const days = parseInt(daysInput.value);

        if (guests <= 0 || days <= 0) {
          document.getElementById("error-message").innerText =
            "El número de huéspedes y días debe ser mayor que 0.";
          return;
        }

        const total = basePrice + hotelPrice * guests * days;

        renderSummary(
          city,
          hotelSelect.options[hotelSelect.selectedIndex].text,
          guests,
          days,
          total
        );
      });
  };

  function renderSummary(city, hotel, guests, days, total) {
    app.innerHTML = `
      <div class="summary-container active">
        <div class="summary-content">
          <h2>Resumen</h2>
          <p>Destino: ${city.city}</p>
          <p>Hotel: ${hotel}</p>
          <p>Huéspedes: ${guests}</p>
          <p>Días: ${days}</p>
          <p class="total">Total: $${total}</p>
          <h3>Datos de facturación</h3>
          <div class="form-group">
            <label for="firstName">Nombre</label>
            <input type="text" id="firstName">
          </div>
          <div class="form-group">
            <label for="lastName">Apellido</label>
            <input type="text" id="lastName">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email">
          </div>
          <div class="form-group">
            <label for="phone">Teléfono</label>
            <input type="tel" id="phone">
          </div>
          <div id="form-error-message" style="color: red;"></div>
          <button onclick="cancelTrip()">Cancelar</button>
          <button onclick="submitTrip()">Viajar!</button>
        </div>
      </div>
    `;
  }

  window.cancelTrip = function () {
    fetch("place.json")
      .then((response) => response.json())
      .then((data) => {
        renderHome(data);
      });
  };

  window.submitTrip = function () {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (!firstName || !lastName || !email || !phone) {
      document.getElementById("form-error-message").innerText =
        "Por favor, complete todos los campos.";
      return;
    }

    showConfirmation();
  };

  window.showConfirmation = function () {
    app.innerHTML = `
      <div class="confirmation-container">
        <h2>¡Felicitaciones!</h2>
        <p>Su información ha sido enviada exitosamente.</p>
        <button onclick="returnHome()">Volver al inicio</button>
      </div>
    `;
  };

  window.returnHome = function () {
    fetch("place.json")
      .then((response) => response.json())
      .then((data) => {
        renderHome(data);
      });
  };
});
