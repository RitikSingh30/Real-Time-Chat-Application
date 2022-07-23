// const socket = io('http://localhost:8000'); // ye harry ne apne video me bataya tha but ye work nahi kar rha tha to stack overflow pe niche wala line mila wo work kar rha hai
// ye client.js alread connected hai humare index.js se through <script defer src="http://localhost:8000/socket.io/socket.io.js"></script> ye wali line jo humne dali hai apne index.html me usski madat se
const socket = io('http://localhost:8000',{transports: ['websocket']});

// Get DOM elements in respective Js variable 
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio that will play on receiving messages 
var audio = new Audio('kessidi-dzyn.mp3');

// Function which will append event info to the container
const append = (message,position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message ;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();   
    }
}

// Ask new user for his/her name and let the server know 
const anotherName = prompt("Enter your name to join");
socket.emit('new-user-joined',anotherName); // ye socket.emit server ko bata rha hai. emit hum batane ke liye use karte hai 

// socket.on hum data ko receive karne ke liye use karte hai 
// yaha pe socket.on server se uss user ka name receive kar rha hai isliye humne socket.on ka use kiya hai
// if a new user joins, receive his/her name from the server 
socket.on('user-joined', name =>{
    append(`${name} Join the chat`,'right');
});

// If server sends a message, receive it 
socket.on('receive',data =>{ 
    append(`${data.name} : ${data.message}` , 'left');  
})

// if a user leaves the chat, append the info to the container 
socket.on('left', name =>{
    append(`${name} left the chat`,'right');
})

// if the form gets submitted, send server the message 
form.addEventListener('submit' , (e)=>{
    e.preventDefault() ;  // form submit karne ke baad page ko reload hone nahi deta 
    const message = messageInput.value ;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value = '' ;
})