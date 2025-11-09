// --- Initialize Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyBd4-Mjaa9dzQDOPsC2q5fPsYACitoODAM",
  authDomain: "parfum-bdada.firebaseapp.com",
  projectId: "parfum-bdada",
  storageBucket: "parfum-bdada.firebasestorage.app",
  messagingSenderId: "24437227357",
  appId: "1:24437227357:web:7a389fbe2d73590d1872b4"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Initialize Pi SDK ---
Pi.init({ version: "2.0", sandbox: true });
let currentPiUser = null;

// --- Login ---
document.getElementById("login").addEventListener("click", async () => {
  try {
    const scopes = ['username', 'payments'];
    const user = await Pi.authenticate(scopes);
    currentPiUser = user;
    alert("Welcome " + user.username);
    document.getElementById("storeDashboard").style.display = "block";
    loadStores(); // Load stores after login
  } catch (err) {
    console.error("Login error:", err);
  }
});

// --- Create Store ---
document.getElementById("storeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentPiUser) return alert("Login first!");

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

  // Save to Firestore
  db.collection("stores").add(storeData)
    .then(() => {
      alert("Store created successfully!");
      loadStores();
      document.getElementById("storeForm").reset();
    })
    .catch(err => console.error("Error adding store: ", err));
});

// --- Load Stores ---
function loadStores() {
  const container = document.getElementById("storeResults");
  container.innerHTML = "";
  db.collection("stores").orderBy("plan", "desc").get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const store = doc.data();
        container.innerHTML += `
          <div class="store-card">
            <h3>${store.name} ${store.plan === 'vip' ? '👑 VIP' : ''}</h3>
            <p>📍 ${store.location.country}, ${store.location.state}, ${store.location.city}</p>
            <p>📞 <a href="tel:${store.contact.phone}">${store.contact.phone}</a></p>
            <p>🌐 <a href="${store.contact.website}" target="_blank">${store.contact.website || ''}</a></p>
          </div>
        `;
      });
    })
    .catch(err => console.error("Error loading stores: ", err));
}