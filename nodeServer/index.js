// Node server which will handle socket io connections
const io = require('socket.io')(8000) // ye socket.io ek server hai jo 8000 port pe run ho rha hai 

const users = {};

// ye io.on sare connections ko handle karta hai jo bhi event io server pe ho rhe hai yaha pe jo 'connection' likha hua hai wo inbuild hai
io.on('connection' , socket =>{

    // If any new user joins, let other users connected to the server know!
    // ye pe jo new-user-joined event likha hai wo custom hai wo humne likha hai waha pe koi bhi naam de sakte hai and wo event ko client.js file me handle karne wale hai 
    // socket.on sare event ko listen karta hai means receive kar rha hai 
    // socket.on will listner incoming data 
    socket.on('new-user-joined', name =>{              
        // socket.id har user ke liye ek unique id deta hai 
        users[socket.id] = name ;
        // socket.broadcast.emit ka use isliye hai because jo bhi event hai wo event ko baki users ko batata hai means basically wo baki users ke liye hota hai
        // socket.broadcast.emit will send the message to all the connected users 
        socket.broadcast.emit('user-joined',name);      
    });

    // if someone sends the message, broadcast it to other people 
    socket.on('send',message =>{
        socket.broadcast.emit('receive',{message: message , name : users[socket.id]});
    });

    // If someone leaves the chat, let others know 
    // uper jo humne kuch even diya the jaise new-user-joined , user-joined , send , receive wo sare even custom event the waha pe hum koi bhi naam de sakte hai but ye wo disconnect event hota hai wo inbuild event hota hai jisko hum koi bhi naam nahi de sakte ye naam server hi hum deta hai jab koi user server leave karta hai 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left',users[socket.id]);
        // user ke leave karne ke baad uss user ko hum apne users wale array me se bhi delete kar de rhe hai 
        delete users[socket.id];
    })
});