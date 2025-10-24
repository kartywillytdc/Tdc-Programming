// Elementos DOM
const authBtn = document.getElementById('auth-btn');
const authSection = document.getElementById('auth-section');
const closeAuth = document.getElementById('close-auth');
const authForm = document.getElementById('auth-form');
const submitAuth = document.getElementById('submit-auth');
const switchAuth = document.getElementById('switch-auth');
const joinBtn = document.getElementById('join-btn');
const firebaseStatus = document.getElementById('firebase-status');
const aiChat = document.getElementById('ai-chat');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendMessage = document.getElementById('send-message');

// Estado da autenticação
let isLogin = true;

// Event Listeners
authBtn.addEventListener('click', () => {
    authSection.classList.remove('hidden');
});

closeAuth.addEventListener('click', () => {
    authSection.classList.add('hidden');
});

switchAuth.addEventListener('click', () => {
    isLogin = !isLogin;
    submitAuth.textContent = isLogin ? 'Entrar' : 'Cadastrar';
    switchAuth.textContent = isLogin ? 'Criar nova conta' : 'Já tenho uma conta';
});

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (isLogin) {
        loginUser(email, password);
    } else {
        registerUser(email, password);
    }
});

joinBtn.addEventListener('click', () => {
    window.open('https://discord.gg/SEU_LINK_DO_DISCORD', '_blank');
});

sendMessage.addEventListener('click', sendChatMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

// Funções de Autenticação
function loginUser(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Usuário logado:', userCredential.user);
            authSection.classList.add('hidden');
            updateUI();
        })
        .catch((error) => {
            alert('Erro no login: ' + error.message);
        });
}

function registerUser(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Usuário criado:', userCredential.user);
            
            // Criar documento do usuário no Firestore
            return db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                role: 'member'
            });
        })
        .then(() => {
            authSection.classList.add('hidden');
            updateUI();
        })
        .catch((error) => {
            alert('Erro no cadastro: ' + error.message);
        });
}

// Monitorar estado de autenticação
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('Usuário conectado:', user.email);
        firebaseStatus.textContent = 'Conectado';
        firebaseStatus.classList.add('connected');
        updateUI();
    } else {
        console.log('Usuário desconectado');
        firebaseStatus.textContent = 'Desconectado';
        firebaseStatus.classList.remove('connected');
        updateUI();
    }
});

// Atualizar UI baseado no estado de autenticação
function updateUI() {
    const user = auth.currentUser;
    
    if (user) {
        authBtn.textContent = 'Sair';
        authBtn.onclick = () => auth.signOut();
        aiChat.classList.remove('hidden');
        loadChatMessages();
    } else {
        authBtn.textContent = 'Entrar';
        authBtn.onclick = () => authSection.classList.remove('hidden');
        aiChat.classList.add('hidden');
    }
}

// Funções do Chat
function sendChatMessage() {
    const message = messageInput.value.trim();
    const user = auth.currentUser;
    
    if (!message || !user) return;
    
    // Adicionar mensagem ao Firestore
    db.collection('chatMessages').add({
        text: message,
        userId: user.uid,
        userEmail: user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        messageInput.value = '';
    })
    .catch((error) => {
        console.error('Erro ao enviar mensagem:', error);
    });
}

function loadChatMessages() {
    db.collection('chatMessages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
            chatMessages.innerHTML = '';
            snapshot.forEach((doc) => {
                const message = doc.data();
                const messageElement = document.createElement('div');
                messageElement.className = 'message';
                messageElement.innerHTML = `
                    <strong>${message.userEmail}:</strong> ${message.text}
                    <small>${new Date(message.timestamp?.toDate()).toLocaleTimeString()}</small>
                `;
                chatMessages.appendChild(messageElement);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
}

// Funções externas
function joinDiscord() {
    window.open('https://discord.gg/SEU_LINK_DO_DISCORD', '_blank');
}

function viewGitHub() {
    window.open('https://github.com/SEU_USUARIO/SEU_REPOSITORIO', '_blank');
}

// Inicialização
updateUI();
