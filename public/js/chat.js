$(function() {
  var nickN = 177385;
  var socket = io.connect("http://mintechnologies.com.mx:10012");

  // Cuando la conección es exitosa le preguntamos al user
  // su nick mediante un prompt y lo emitimos al servidor
  socket.on("connect", function() {
      socket.emit("nick", nickN);
  });

  $('#msg-input input').keypress(function(e) {
      if (e.which == 13) {
          // Cuando se presiona enter en el input
          // emitimos el contenido de dicho input
          $(document.createElement("div")).html("<div id='from'>"+ $('#mensaje').val()+"</div>").appendTo("#messages");
          item = jQuery.parseJSON( '{ "mensaje": "'+$('#mensaje').val()+'", "name": "'+$('#name').val()+'", "from": "'+nickN+'", "to": "'+$('#to').val()+'", "type": "'+$('#type').val()+'" }' );
          socket.emit("msg", item);
          $(this).val('');
      }
  });

  // Cuando el cliente recibe un mensaje, creamos un div
  // Ponemos el nick y el mensaje dentro y lo agregamos
  // a la lista de mensajes
  socket.on("msg", function(nick, msg) {
      var push = jQuery.parseJSON(msg);
      $(document.createElement("div")).html("<div id='from'>"+ push.mensa  + push.seudo  +"</div>").appendTo("#messages");

      // Esto nos permite mantener visible el último mensaje
      $('#messages-container').scrollTop($('#messages').height());
  });

  // Cuando el cliente recibe una lista de nicks
  socket.on("nicks", function(nicks) {
      $("#users").html('');
      //console.log(nicks);
      for (var i = 0; i < nicks.length; i++) {
          //console.log(nicks[i]);
      }
  });

});