// LABSOUND
// Laboratorio virtual de reducción sonora

// DATOS EXPERIMENTALES
const materiales = {
    referencia: {
        titulo: "Sin material",
        emoji: "📢",
        rms: [
            0.15962454,
            0.15789674,
            0.15638948,
            0.16290441,
            0.16436180
        ],
        audios: [
            "audios/referencia1.mp3",
            "audios/referencia2.mp3",
            "audios/referencia3.mp3",
            "audios/referencia4.mp3",
            "audios/referencia5.mp3"
        ]
    },
    espuma: {
        titulo: "Espuma",
        emoji: "🟦",
        rms: [
            0.14982771,
            0.15690980,
            0.15443564,
            0.15203402,
            0.14861345
        ],
        audios: [
            "audios/espuma1.mp3",
            "audios/espuma2.mp3",
            "audios/espuma3.mp3",
            "audios/espuma4.mp3",
            "audios/espuma5.mp3"
        ]
    },
    carton: {
        titulo: "Cartón corrugado",
        emoji: "🟫",
        rms: [
            0.15931468,
            0.15834667,
            0.15607468,
            0.15564928,
            0.16359753
        ],
        audios: [
            "audios/carton1.mp3",
            "audios/carton2.mp3",
            "audios/carton3.mp3",
            "audios/carton4.mp3",
            "audios/carton5.mp3"
        ]
    },
    madera: {
        titulo: "Madera",
        emoji: "🪵",
        rms: [
            0.15807090,
            0.15576241,
            0.15868519,
            0.15402107,
            0.15892992
        ],
        audios: [
            "audios/madera1.mp3",
            "audios/madera2.mp3",
            "audios/madera3.mp3",
            "audios/madera4.mp3",
            "audios/madera5.mp3"
        ]
    },
    tela: {
        titulo: "Tela",
        emoji: "🧶",
        rms: [
            0.14759639,
            0.14976019,
            0.14843271,
            0.14671833,
            0.14849237
        ],
        audios: [
            "audios/tela1.mp3",
            "audios/tela2.mp3",
            "audios/tela3.mp3",
            "audios/tela4.mp3",
            "audios/tela5.mp3"
        ]
    }
};

// REFERENCIAS A LAS PANTALLAS
const pantallaInicio =
    document.getElementById("pantallaInicio");
const pantallaPrediccion =
    document.getElementById("pantallaPrediccion");
const pantallaMateriales =
    document.getElementById("pantallaMateriales");
const pantallaEnsayos =
    document.getElementById("pantallaEnsayos");
const pantallaResultados =
    document.getElementById("pantallaResultados");
const pantallaResultadosFinales =
    document.getElementById("pantallaResultadosFinales");    

// REFERENCIAS A ELEMENTOS DE ENSAYOS
const contadorEnsayo =
    document.getElementById("contadorEnsayo");
const resultadoEnsayo =
    document.getElementById("resultadoEnsayo");
const botonSiguiente =
    document.getElementById("botonSiguiente");
const estadoAudio =
    document.getElementById("estadoAudio");

// VARIABLES DEL EXPERIMENTO
let materialActual = "espuma";
let ensayoActual = 0;
let audioActual = new Audio();
let graficoEnsayos = null;
let prediccionUsuario = "";
let materialesCompletados = [];

// FUNCIÓN PARA CAMBIAR DE PANTALLA
function mostrarPantalla(pantalla) {
    const pantallas = [
    pantallaInicio,
    pantallaPrediccion,
    pantallaMateriales,
    pantallaEnsayos,
    pantallaResultados,
    pantallaResultadosFinales
];
    pantallas.forEach(function (elemento) {
        if (elemento) {
            elemento.classList.add("oculto");
        }
    });
    if (pantalla) {
        pantalla.classList.remove("oculto");
    }

    // Detener audio cuando cambiamos de pantalla
    audioActual.currentTime = 0;
}

// FUNCIÓN PARA MOSTRAR NÚMEROS
function numero(valor, decimales = 5) {
    return valor
        .toFixed(decimales)
        .replace(".", ",");
}

// PROMEDIO
function promedio(numeros) {
    return numeros.reduce(
        function (suma, valor) {
            return suma + valor;
        },
        0
    ) / numeros.length;
}

// DESVIACIÓN ESTÁNDAR MUESTRAL
function desviacionMuestral(numeros) {
    const media = promedio(numeros);
    const sumaCuadrados = numeros.reduce(
        function (total, valor) {
            return total + Math.pow(valor - media, 2);
        },
        0
    );
    return Math.sqrt(
        sumaCuadrados / (numeros.length - 1)
    );
}

// REDUCCIÓN RELATIVA RESPECTO A LA REFERENCIA
function reduccionRelativa(material) {
    const rmsReferencia =
        promedio(materiales.referencia.rms);
    const rmsMaterial =
        promedio(materiales[material].rms);
    return (
        100 *
        (rmsReferencia - rmsMaterial) /
        rmsReferencia
    );
}

// ACTUALIZAR ENSAYO
function actualizarEnsayo() {
    const datos =
        materiales[materialActual];
    const tituloEnsayo =
        document.getElementById("tituloEnsayo");
    if (tituloEnsayo) {
        tituloEnsayo.textContent =
            datos.emoji + " " + datos.titulo;
    }
    contadorEnsayo.textContent =
        "Ensayo " +
        (ensayoActual + 1) +
        " de " +
        datos.rms.length;
    resultadoEnsayo.textContent =
        "Amplitud RMS: " +
        numero(datos.rms[ensayoActual]);
    if (ensayoActual === datos.rms.length - 1) {
        botonSiguiente.textContent =
            "Ver resultados →";
    } else {
        botonSiguiente.textContent =
            "Siguiente ensayo →";
    }
    estadoAudio.textContent = "";
}

// INICIAR MATERIAL
function iniciarMaterial(material) {
    if (!materiales[material]) {
        return;
    }
    materialActual = material;
    ensayoActual = 0;
    mostrarPantalla(pantallaEnsayos);
    actualizarEnsayo();
}

// MOSTRAR RESULTADOS DEL MATERIAL
function mostrarResultados() {
    const datos =
        materiales[materialActual];
        if (
    materialActual !== "referencia" &&
    !materialesCompletados.includes(materialActual)
     ) {
    materialesCompletados.push(materialActual);
    }
    const media =
        promedio(datos.rms);
    const desviacion =
        desviacionMuestral(datos.rms);
    const reduccion =
        reduccionRelativa(materialActual);
    mostrarPantalla(pantallaResultados);

    // Título
    const tituloResultados =
        document.getElementById("tituloResultados");
    if (tituloResultados) {
        tituloResultados.textContent =
            "Resultados — " +
            datos.titulo +
            " " +
            datos.emoji;
    }

    // Promedio

    const promedioRMS =
        document.getElementById("promedioRMS");
    if (promedioRMS) {
        promedioRMS.textContent =
            numero(media);
    }

    // Desviación
    const desviacionRMS =
        document.getElementById("desviacionRMS");
    if (desviacionRMS) {
        desviacionRMS.textContent =
            numero(desviacion);
    }

    // Número de ensayos
    const numeroEnsayos =
        document.getElementById("numeroEnsayos");
    if (numeroEnsayos) {
        numeroEnsayos.textContent =
            datos.rms.length;
    }

    // Reducción
    const reduccionRMS =
        document.getElementById("reduccionRMS");
    if (reduccionRMS) {
        if (materialActual === "referencia") {
            reduccionRMS.textContent =
                "Referencia";
        } else {
            const signo =
                reduccion >= 0 ? "−" : "+";
            reduccionRMS.textContent =
                signo +
                numero(Math.abs(reduccion), 2) +
                " %";
        }
    }

    // Conclusión individual
    const conclusion =
        document.getElementById("conclusion");
    if (conclusion) {
        if (materialActual === "referencia") {
            conclusion.textContent =
                "Esta condición sin material es nuestra referencia para comparar los otros materiales.";
        } else if (reduccion >= 0) {
            conclusion.textContent =
                "En este montaje, " +
                datos.titulo.toLowerCase() +
                " registró una amplitud RMS promedio " +
                numero(reduccion, 2) +
                " % menor que la referencia.";
        } else {
            conclusion.textContent =
                "En este montaje, " +
                datos.titulo.toLowerCase() +
                " registró una amplitud RMS promedio " +
                numero(Math.abs(reduccion), 2) +
                " % mayor que la referencia.";
        }
    }
    dibujarGraficoEnsayos();
}

// GRÁFICO DE LOS ENSAYOS
function dibujarGraficoEnsayos() {
    const canvas =
        document.getElementById("graficoEnsayos");
    const error =
        document.getElementById("errorGrafico");
    if (!canvas) {
        return;
    }
    if (error) {
        error.textContent = "";
    }

    // Comprobar Chart.js
    if (typeof Chart === "undefined") {
        if (error) {
            error.textContent =
                "No se pudo cargar el gráfico. Los resultados numéricos siguen disponibles.";
        }
        return;
    }

    // Eliminar gráfico anterior
    if (graficoEnsayos) {
        graficoEnsayos.destroy();
    }
    const datos =
        materiales[materialActual];
    const media =
        promedio(datos.rms);

    // Crear gráfico
    graficoEnsayos =
        new Chart(canvas, {
            type: "bar",
            data: {
                labels: datos.rms.map(
                    function (_, indice) {
                        return "Ensayo " + (indice + 1);
                    }
                ),
                datasets: [
                    {
                        label: "Amplitud RMS",
                        data: datos.rms,
                        backgroundColor:
                            "rgba(47, 158, 229, 0.72)",
                        borderRadius: 6
                    },
                    {
                        type: "line",
                        label: "Promedio",
                        data: datos.rms.map(
                            function () {
                                return media;
                            }
                        ),
                        borderColor:
                            "#ee7d7d",
                        backgroundColor:
                            "#ee7d7d",
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Amplitud RMS"
                        }
                    }
                }
            }
        });
}

// BOTÓN COMENZAR
const botonComenzar =
    document.getElementById("botonComenzar");
if (botonComenzar) {
    botonComenzar.addEventListener(
        "click",
        function () {
            mostrarPantalla(
                pantallaPrediccion
            );
        }
    );
}

// PREDICCIÓN DEL USUARIO
const botonesPrediccion =
    document.querySelectorAll(
        ".boton-prediccion"
    );
botonesPrediccion.forEach(
    function (boton) {
        boton.addEventListener(
            "click",
            function () {
                prediccionUsuario =
                    boton.dataset.material;
                console.log(
                    "Predicción del usuario:",
                    prediccionUsuario
                );
                mostrarPantalla(
                    pantallaMateriales
                );
            }
        );
    }
);

// BOTONES DE MATERIALES

// Botones de materiales
const botonesMaterial =
    document.querySelectorAll(".boton-material");
botonesMaterial.forEach(function (boton) {
    boton.addEventListener("click", function () {
        const material =
            boton.dataset.material;
        iniciarMaterial(material);
    });
});

// BOTÓN REPRODUCIR AUDIO
const botonReproducir =
    document.getElementById(
        "botonReproducir"
    );
if (botonReproducir) {
    botonReproducir.addEventListener(
        "click",
        async function () {
            audioActual.pause();
            audioActual =
                new Audio(
                    materiales[
                        materialActual
                    ].audios[
                        ensayoActual
                    ]
                );
            estadoAudio.textContent =
                "Reproduciendo la medición…";
            audioActual.addEventListener(
                "ended",
                function () {
                    estadoAudio.textContent =
                        "Grabación terminada.";
                }
            );
            audioActual.addEventListener(
                "error",
                function () {
                    estadoAudio.textContent =
                        "No se encontró el audio. Revisa que la carpeta audios esté incluida.";
                }
            );
            try {
                await audioActual.play();
            } catch (error) {
                estadoAudio.textContent =
                    "No fue posible reproducir el audio.";
            }
        }
    );
}

// BOTÓN SIGUIENTE ENSAYO
if (botonSiguiente) {
    botonSiguiente.addEventListener(
        "click",
        function () {
            const total =
                materiales[
                    materialActual
                ].rms.length;
            if (
                ensayoActual <
                total - 1
            ) {
                audioActual.pause();
                ensayoActual++;
                actualizarEnsayo();
            } else {
                mostrarResultados();
            }
        }
    );
}

// VOLVER AL INICIO
const volverInicio =
    document.getElementById(
        "volverInicio"
    );
if (volverInicio) {
    volverInicio.addEventListener(
        "click",
        function () {
            mostrarPantalla(
                pantallaInicio
            );
        }
    );
}

// VOLVER A MATERIALES
const volverMateriales =
    document.getElementById(
        "volverMateriales"
    );
if (volverMateriales) {
    volverMateriales.addEventListener(
        "click",
        function () {
            mostrarPantalla(
                pantallaMateriales
            );
        }
    );
}

// BOTÓN OTRO MATERIAL
const botonOtroMaterial =
    document.getElementById(
        "botonOtroMaterial"
    );
if (botonOtroMaterial) {
    botonOtroMaterial.addEventListener(
        "click",
        function () {
            if (materialesCompletados.length === 4) {
                mostrarResultadosFinales();
            } else {
                mostrarPantalla(
                    pantallaMateriales
                );
            }
        }
    );
}

// RESULTADOS FINALES

function mostrarResultadosFinales() {
    mostrarPantalla(
        pantallaResultadosFinales
    );

    // Materiales que se comparan
    const materialesComparables = [
        "espuma",
        "carton",
        "madera",
        "tela"
    ];

    // Calcular reducción de cada material
    const resultadosFinales =
        materialesComparables.map(
            function (material) {
                return {
                    material: material,
                    nombre:
                        materiales[material].titulo,
                    emoji:
                        materiales[material].emoji,
                    reduccion:
                        reduccionRelativa(material)
                };
            }
        );

    // Buscar el que tenga mayor reducción
    const ganador =
        resultadosFinales.reduce(
            function (mayor, actual) {
                return actual.reduccion > mayor.reduccion
                    ? actual
                    : mayor;
            }
        );

    // Gráfico final
    const canvas =
        document.getElementById(
            "graficoComparacion"
        );
    if (!canvas) {
        return;
    }
    if (typeof Chart === "undefined") {
        return;
    }
    new Chart(
        canvas,
        {
            type: "bar",
            data: {
                labels:
                    resultadosFinales.map(
                        function (resultado) {
                            return (
                                resultado.emoji +
                                " " +
                                resultado.nombre
                            );
                        }
                    ),
                datasets: [
                    {
                        label:
                            "Reducción relativa (%)",
                        data:
                            resultadosFinales.map(
                                function (resultado) {
                                    return resultado.reduccion;
                                }
                            ),
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text:
                                "Reducción relativa (%)"
                        }
                    }
                }
            }
        }
    );
}

// RESULTADOS FINALES
function mostrarResultadosFinales() {
    mostrarPantalla(
        pantallaResultadosFinales
    );

    // Materiales que se comparan
    const materialesComparables = [
        "espuma",
        "carton",
        "madera",
        "tela"
    ];

    // Calcular reducción de cada material
    const resultadosFinales =
        materialesComparables.map(
            function (material) {
                return {
                    material: material,
                    nombre:
                        materiales[material].titulo,
                    emoji:
                        materiales[material].emoji,
                    reduccion:
                        reduccionRelativa(material)
                };
            }
        );

    // Buscar el que tenga mayor reducción
    const ganador =
        resultadosFinales.reduce(
            function (mayor, actual) {
                return actual.reduccion > mayor.reduccion
                    ? actual
                    : mayor;
            }
        );

    // Mostrar ganador
    const materialGanador =
        document.getElementById(
            "materialGanador"
        );
    materialGanador.textContent =
        ganador.emoji +
        " " +
        ganador.nombre;

    // Mostrar predicción
    const prediccionFinal =
        document.getElementById(
            "prediccionFinal"
        );
    prediccionFinal.textContent =
        prediccionUsuario;

    // Comprobar si acertó
    const resultadoPrediccion =
        document.getElementById(
            "resultadoPrediccion"
        );
    if (
        prediccionUsuario.toLowerCase() ===
        ganador.nombre.toLowerCase()
    ) {
        resultadoPrediccion.textContent =
            "🎉 ¡Acertaste! Tu predicción coincidió con el material que presentó la mayor reducción de amplitud RMS.";
    } else {
        resultadoPrediccion.textContent =
            "👀 Tu predicción fue diferente al resultado experimental. El material con mayor reducción de amplitud RMS fue " +
            ganador.nombre +
            ".";
    }
    // Gráfico final
    const canvas =
        document.getElementById(
            "graficoComparacion"
        );
    if (!canvas) {
        return;
    }
    if (typeof Chart === "undefined") {
        return;
    }
    new Chart(
        canvas,
        {
            type: "bar",
            data: {
                labels:
                    resultadosFinales.map(
                        function (resultado) {
                            return (
                                resultado.emoji +
                                " " +
                                resultado.nombre
                            );
                        }
                    ),
                datasets: [
                    {
                        label:
                            "Reducción relativa (%)",
                        data:
                            resultadosFinales.map(
                                function (resultado) {
                                    return resultado.reduccion;
                                }
                            ),
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text:
                                "Reducción relativa (%)"
                        }
                    }
                }
            }
        }
    );
}