// Substitua com suas configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDBGLNWWZyNSml_YZ_aP5ecJloUPYV-r1M",
  authDomain: "tdc-programming.firebaseapp.com",
  projectId: "tdc-programming",
  storageBucket: "tdc-programming.firebasestorage.app",
  messagingSenderId: "783781234891",
  appId: "1:783781234891:web:b03638dcd1a18a67e2334e",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar serviços
const auth = firebase.auth();
const db = firebase.firestore();
