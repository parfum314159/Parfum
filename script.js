Pi.init({ version: "2.0", sandbox: true });

let currentPiUser = null;

document.getElementById("login").addEventListener("click", async () => {
  try {
    const scopes = ['username', 'payments'];
    const user = await Pi.authenticate(scopes);
    currentPiUser = user;
    alert("Welcome " + user.username);
    document.getElementById("storeDashboard").style.display = "block";
  } catch (err) {
    console.error("Login error:", err);
  }
});

document.getElementById("storeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const storeData = {
    name: document.getElementById("storeName").value,
    location: {
      country: document.getElementById("country").value,
      state: document.getElementById("state").value,
      city: document.getElementById("city").value
    },
    contact: {
      phone: document.getElementById("phone").value,
      website: document.getElementById("website").value
    },
    owner: currentPiUser ? currentPiUser.uid : "unknown",
    plan: document.getElementById("plan").value,
    createdAt: Date.now()
  };

  alert("Store Created: " + storeData.name + " (" + storeData.plan + ")");
  console.log(storeData);

  const container = document.getElementById("storeResults");
  container.innerHTML += `
    <div class="store-card">
      <h3>${storeData.name} ${storeData.plan === 'vip' ? '👑 VIP' : ''}</h3>
      <p>📍 ${storeData.location.country}, ${storeData.location.state}, ${storeData.location.city}</p>
      <p>📞 <a href="tel:${storeData.contact.phone}">${storeData.contact.phone}</a></p>
      <p>🌐 <a href="${storeData.contact.website}" target="_blank">${storeData.contact.website || ''}</a></p>
    </div>
  `;
});