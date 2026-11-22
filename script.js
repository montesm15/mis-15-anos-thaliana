/* ===== Edita solo estos datos ===== */
var CFG = {
  nombre: "Thaliana",
  fecha: "2026-12-19T19:30:00-05:00",      // año-mes-díaTHH:MM con la zona del evento (Colombia = -05:00)
  zona: "America/Bogota",                  // zona horaria con la que se muestran fecha y hora
  fin: "2026-12-20T02:00:00-05:00",         // hora de cierre del evento (para el calendario)
  confirmarAntes: "1 de diciembre",
  lugar: "Salón de Eventos Bellavista",
  direccion: "Cl. 16, Sincelejo, Sucre",     // texto que se muestra bajo el nombre del salón
  mapa: "https://maps.app.goo.gl/9JdFUy1NMCwYrjYS8", // enlace de Google Maps (si lo dejas vacío se busca por nombre y dirección)
  whatsapp: "573002643732",                // código de país + número, sin + ni espacios
  invitadoPorDefecto: "",                  // opcional: nombre para el mensaje de WhatsApp si el enlace no trae invitado
  invitados: {                             // opcional (solo para el mensaje de WhatsApp): index.html#familia-montes-padilla
    "familia-montes-padilla": "Familia Montes Padilla"
  },
  musica: "musica/cancion.mp3",             // ruta de la canción; vacío = melodía integrada
  tituloMusica: "A Thousand Years"
};
/* ================================== */

function $(id){ return document.getElementById(id); }

/* ---------- Invitado (por enlace) ---------- */
/* Opciones: index.html?invitado=Familia%20Montes%20Padilla   o   index.html#familia-montes-padilla */
function leerInvitado(){
  var q = new URLSearchParams(location.search).get("invitado");
  if (q) return q.trim();
  var h = decodeURIComponent(location.hash.replace("#", "")).toLowerCase();
  if (!h) return "";
  if (CFG.invitados[h]) return CFG.invitados[h];
  return h.replace(/[-_]+/g, " ").replace(/(^|\s)(\p{L})/gu, function(m, a, b){ return a + b.toUpperCase(); });
}
var invitado = leerInvitado() || CFG.invitadoPorDefecto;

/* ---------- Textos y enlaces ---------- */
$("nombre").textContent = CFG.nombre;
$("firma").textContent = CFG.nombre;
$("limite").textContent = CFG.confirmarAntes;
$("lugar").textContent = CFG.lugar;
$("direccion").textContent = CFG.direccion;
$("tema").textContent = CFG.tituloMusica;
$("mapa").href = CFG.mapa || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CFG.lugar + ", " + CFG.direccion);
var mensaje = (invitado ? "¡Hola! Les escribe " + invitado + ". " : "¡Hola! ") +
  "Confirmo mi asistencia a los 15 años de " + CFG.nombre + ". ¿Podrían indicarme cuál es mi cupo asignado?";
$("wa").href = "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(mensaje);


/* ---------- Confirmación: check en el botón ---------- */
(function(){
  var btn = $("wa"), txt = $("waTxt"), nota = $("waNota"), clave = "xv-confirmacion-" + (invitado || "general");
  function marcar(yaIniciada){
    btn.classList.add("hecho");
    txt.textContent = "Confirmación iniciada";
    nota.textContent = yaIniciada
      ? "Ya iniciaste tu confirmación. Si necesitas enviarla de nuevo, toca el botón otra vez."
      : "Se abrió WhatsApp. Si aún no enviaste el mensaje, toca el botón otra vez.";
  }
  function chispas(){
    var cont = document.createElement("span"); cont.className = "burst";
    var colores = ["#4a7fc8", "#9cc0ff", "#2f5da3", "#bcd2f2"];
    for (var i = 0; i < 14; i++) {
      var p = document.createElement("i"), ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4, d = 60 + Math.random() * 50;
      p.style.setProperty("--x", Math.cos(ang) * d + "px");
      p.style.setProperty("--y", Math.sin(ang) * d + "px");
      p.style.setProperty("--c", colores[i % colores.length]);
      p.style.width = p.style.height = (4 + Math.random() * 5) + "px";
      cont.appendChild(p);
    }
    btn.parentNode.appendChild(cont);
    setTimeout(function(){ cont.remove(); }, 1300);
  }
  try { if (localStorage.getItem(clave)) marcar(true); } catch (e) {}
  btn.addEventListener("click", function(){
    marcar(false);
    btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
    if (!matchMedia("(prefers-reduced-motion:reduce)").matches) chispas();
    try { localStorage.setItem(clave, "1"); } catch (e) {}   // solo recuerda que tocó el botón en este teléfono
  });
})();

/* ---------- Fecha grande ---------- */
var f = new Date(CFG.fecha);
var Z = CFG.zona;
$("dDia").textContent = f.toLocaleDateString("es-CO", {weekday: "long", timeZone: Z});
$("dNum").textContent = f.toLocaleDateString("es-CO", {day: "numeric", timeZone: Z});
$("dMes").textContent = f.toLocaleDateString("es-CO", {month: "long", year: "numeric", timeZone: Z});
$("dHora").textContent = f.toLocaleTimeString("es-CO", {hour: "numeric", minute: "2-digit", timeZone: Z});

/* ---------- Cuenta regresiva ---------- */
var meta = f.getTime();
function tick(){
  var t = Math.max(0, meta - Date.now()), s = Math.floor(t / 1000);
  $("d").textContent = Math.floor(s / 86400);
  $("h").textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, "0");
  $("m").textContent = String(Math.floor(s % 3600 / 60)).padStart(2, "0");
  $("s").textContent = String(s % 60).padStart(2, "0");
}
tick(); setInterval(tick, 1000);

/* ---------- Agregar al calendario ---------- */
(function(){
  var ini = f, fin = new Date(CFG.fin);
  function utc(d){ return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  var titulo = "15 años de " + CFG.nombre;
  var lugar = CFG.lugar + ", " + CFG.direccion;
  var detalle = "Te esperamos en la celebración de los 15 años de " + CFG.nombre + ". Vestimenta: formal." + (CFG.mapa ? " Ubicación: " + CFG.mapa : "");
  $("calG").href = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(titulo) +
    "&dates=" + utc(ini) + "/" + utc(fin) + "&details=" + encodeURIComponent(detalle) +
    "&location=" + encodeURIComponent(lugar) + "&ctz=" + encodeURIComponent(CFG.zona);
})();

/* ---------- Música ---------- */
var vol = 0.6, sonando = false, audio = null;
var ctx = null, master = null, timer = null, prox = 0, paso = 0;
if (CFG.musica) {
  audio = new Audio(CFG.musica); audio.loop = true; audio.volume = vol; audio.preload = "auto";
  audio.addEventListener("error", function(){ audio = null; if (sonando) reproducir(); }); // si el archivo no carga, suena la melodía integrada
}

/* Melodía integrada: vals tipo cajita de música (compás de 3/4). Cada compás: [bajo, acorde, melodía] */
var PARTITURA = [
  [48,[60,64,67],[79,76,72]], [45,[60,64,69],[69,72,76]],
  [41,[60,65,69],[77,74,72]], [43,[59,62,67],[71,74,79]],
  [48,[60,64,67],[79,76,72]], [45,[60,64,69],[76,72,69]],
  [50,[62,65,69],[77,74,69]], [43,[59,62,67],[71,74,67]]
];
var PULSO = 60 / 84;
function frec(n){ return 440 * Math.pow(2, (n - 69) / 12); }
function nota(n, t, dur, g){
  var o = ctx.createOscillator(), a = ctx.createGain();
  o.type = "triangle"; o.frequency.value = frec(n);
  a.gain.setValueAtTime(0.0001, t);
  a.gain.exponentialRampToValueAtTime(g, t + 0.012);
  a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(a); a.connect(master); o.start(t); o.stop(t + dur + 0.05);
}
function programar(){
  while (prox < ctx.currentTime + 0.8) {
    var c = PARTITURA[Math.floor(paso / 3) % PARTITURA.length], k = paso % 3;
    nota(c[2][k], prox, PULSO * 2.2, 0.2);
    if (k === 0) nota(c[0], prox, PULSO * 2.5, 0.22);
    else c[1].forEach(function(n){ nota(n, prox, PULSO, 0.06); });
    prox += PULSO; paso++;
  }
}
function iniciarSintetizador(){
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.gain.value = vol;
  var d = ctx.createDelay(), fb = ctx.createGain();           // eco suave
  d.delayTime.value = 0.34; fb.gain.value = 0.32;
  master.connect(ctx.destination); master.connect(d); d.connect(fb); fb.connect(d); d.connect(ctx.destination);
  prox = ctx.currentTime + 0.1;
}
function pintar(){
  $("ppIcono").setAttribute("d", sonando ? "M6 5h4v14H6zM14 5h4v14h-4z" : "M8 5v14l11-7z");
  $("pp").setAttribute("aria-pressed", sonando);
}
function reproducir(){
  try {
    if (audio) {
      var p = audio.play();
      if (p && p.catch) p.catch(function(){ sonando = false; pintar(); });
    } else {
      iniciarSintetizador(); ctx.resume();
      clearInterval(timer); timer = setInterval(programar, 200); programar();
    }
    sonando = true;
  } catch (e) { sonando = false; }
  pintar();
}
function pausar(){
  if (audio) audio.pause();
  else if (ctx) { clearInterval(timer); ctx.suspend(); }
  sonando = false; pintar();
}
$("pp").addEventListener("click", function(){ sonando ? pausar() : reproducir(); });
$("vol").addEventListener("input", function(){
  vol = +this.value;
  if (audio) audio.volume = vol; else if (master) master.gain.value = vol;
});
pintar();

/* ---------- Aparición al hacer scroll ---------- */
function iniciarReveal(){
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  var root = document.documentElement;
  var els = document.querySelectorAll("main section > *, main footer > *");
  els.forEach(function(el){
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty("--d", Math.min(i, 6) * 0.09 + "s");   // los elementos de un bloque entran uno tras otro
    el.classList.add("rev");
  });
  root.classList.add("js-rev");
  void root.offsetWidth;
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold: 0.12, rootMargin: "0px 0px -6% 0px"});
  els.forEach(function(el){ io.observe(el); });
}

/* ---------- Primera pantalla: zoom y desvanecido ---------- */
(function(){
  var intro = $("intro"), root = document.documentElement, abierto = false;
  root.classList.add("locked", "oculta");
  $("sobre").addEventListener("click", function(){
    if (abierto) return; abierto = true;
    reproducir();                                   // la música arranca con el toque
    intro.classList.add("open");                    // el sobre se acerca (zoom) y se desvanece
    var espera = matchMedia("(prefers-reduced-motion:reduce)").matches ? 150 : 1400;
    setTimeout(function(){
      intro.classList.add("gone");                  // la pantalla se disuelve y aparece la invitación
      root.classList.remove("locked", "oculta");
      window.scrollTo(0, 0);
      iniciarReveal();
    }, espera);
  });
})();

/* ---------- Destellos de fondo ---------- */
(function(){
  var cont = $("destellos");
  if (!cont || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  for (var i = 0; i < 30; i++) {
    var d = document.createElement("i"), t = 8 + Math.random() * 18;
    d.style.left = (Math.random() * 100) + "%";
    d.style.top = (Math.random() * 100) + "%";
    d.style.width = d.style.height = t + "px";
    d.style.animationDelay = (-Math.random() * 5) + "s";
    d.style.animationDuration = (2.4 + Math.random() * 3.4) + "s";
    cont.appendChild(d);
  }
})();
