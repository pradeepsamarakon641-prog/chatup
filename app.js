import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "chatup-c6342.firebaseapp.com",
projectId: "chatup-c6342",
storageBucket: "chatup-c6342.firebasestorage.app",
messagingSenderId: "905162145969",
appId: "1:905162145969:web:b3e8b1e3b5b3f82863a290"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.signup = async () => {
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

await createUserWithEmailAndPassword(auth,email,password);
};

window.login = async () => {
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

await signInWithEmailAndPassword(auth,email,password);
};

window.logout = async () => {
await signOut(auth);
};

window.sendMessage = async () => {
const text=document.getElementById("messageInput").value;

if(!text) return;

await addDoc(collection(db,"messages"),{
text,
email:auth.currentUser.email,
createdAt:serverTimestamp()
});

document.getElementById("messageInput").value="";
};

onAuthStateChanged(auth,(user)=>{
if(user){
document.getElementById("auth").style.display="none";
document.getElementById("chat").style.display="block";

const q=query(
collection(db,"messages"),
orderBy("createdAt")
);

onSnapshot(q,(snapshot)=>{
let html="";

snapshot.forEach((doc)=>{
const msg=doc.data();

html+=`
<div class="message">
<b>${msg.email}</b><br>
${msg.text}
</div>
`;
});

document.getElementById("messages").innerHTML=html;
});
}
else{
document.getElementById("auth").style.display="block";
document.getElementById("chat").style.display="none";
}
});
