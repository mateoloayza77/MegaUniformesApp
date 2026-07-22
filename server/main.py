import os
import re
import unicodedata
from typing import Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

from services.inventario_service import (
    buscar_productos,
    obtener_colegios,
    obtener_prendas
)


# ==========================================
# CONFIGURACIÓN GENERAL
# ==========================================

load_dotenv()

app = FastAPI(
    title="API MegaUniformes",
    description="Chatbot empresarial conectado al inventario",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

MODEL = os.getenv(
    "OPENROUTER_MODEL",
    "openai/gpt-4o-mini"
)


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []


# ==========================================
# FUNCIONES DE TEXTO
# ==========================================

def normalizar_texto(texto) -> str:
    if texto is None:
        return ""

    texto = str(texto).lower().strip()
    texto = unicodedata.normalize("NFD", texto)

    texto = "".join(
        caracter
        for caracter in texto
        if unicodedata.category(caracter) != "Mn"
    )

    texto = re.sub(r"\s+", " ", texto)

    return texto.strip()


def obtener_conversacion_usuario(request: ChatRequest) -> List[str]:
    """
    Obtiene solamente los mensajes del usuario y evita duplicar
    el mensaje actual cuando ya viene incluido en history.
    """

    mensajes = []

    if request.history:
        for mensaje in request.history:
            if mensaje.get("role") == "user":
                contenido = str(
                    mensaje.get("content", "")
                ).strip()

                if contenido:
                    mensajes.append(contenido)

    mensaje_actual = request.message.strip()

    if (
        mensaje_actual
        and (
            not mensajes
            or mensajes[-1] != mensaje_actual
        )
    ):
        mensajes.append(mensaje_actual)

    return mensajes


def construir_contexto_usuario(request: ChatRequest) -> str:
    mensajes = obtener_conversacion_usuario(request)
    return " ".join(mensajes)


# ==========================================
# INTENCIONES GENERALES
# ==========================================

def es_saludo_simple(texto: str) -> bool:
    texto = normalizar_texto(texto)

    saludos = {
        "hola",
        "holi",
        "buenas",
        "buenos dias",
        "buen dia",
        "buenas tardes",
        "buenas noches",
        "que tal",
        "saludos"
    }

    return texto in saludos


def es_agradecimiento_o_despedida(texto: str) -> bool:
    texto = normalizar_texto(texto)

    expresiones = [
        "gracias",
        "muchas gracias",
        "eso es todo",
        "hasta luego",
        "nos vemos",
        "chao",
        "adios"
    ]

    return any(
        expresion in texto
        for expresion in expresiones
    )


def es_consulta_horario(texto: str) -> bool:
    texto = normalizar_texto(texto)

    expresiones = [
        "horario",
        "a que hora",
        "hora abren",
        "hora cierran",
        "cuando atienden",
        "estan abiertos",
        "atienden hoy"
    ]

    return any(
        expresion in texto
        for expresion in expresiones
    )


def es_consulta_pago(texto: str) -> bool:
    texto = normalizar_texto(texto)

    expresiones = [
        "metodo de pago",
        "metodos de pago",
        "forma de pago",
        "formas de pago",
        "se puede pagar",
        "aceptan tarjeta",
        "aceptan transferencia",
        "efectivo"
    ]

    return any(
        expresion in texto
        for expresion in expresiones
    )


def es_consulta_ubicacion(texto: str) -> bool:
    texto = normalizar_texto(texto)

    expresiones = [
        "ubicacion",
        "direccion",
        "donde quedan",
        "donde estan",
        "como llegar"
    ]

    return any(
        expresion in texto
        for expresion in expresiones
    )


def tiene_intencion_de_compra(texto: str) -> bool:
    texto = normalizar_texto(texto)

    palabras = [
        "uniforme",
        "uniformes",
        "prenda",
        "comprar",
        "busco",
        "necesito",
        "quiero",
        "disponible",
        "disponibilidad",
        "precio",
        "talla",
        "colegio",
        "escuela",
        "chompa",
        "camisa",
        "camiseta",
        "polo",
        "pantalon",
        "falda",
        "buzo",
        "short",
        "medias",
        "corbata",
        "chaleco",
        "mandil",
        "chaqueta",
        "educacion fisica",
        "deportivo",
        "calentador"
    ]

    return any(
        palabra in texto
        for palabra in palabras
    )


# ==========================================
# DETECCIÓN DE DATOS DEL CLIENTE
# ==========================================

def detectar_colegio(texto: str):
    texto_normalizado = normalizar_texto(texto)
    coincidencias = []

    for colegio in obtener_colegios():
        colegio_normalizado = normalizar_texto(colegio)

        if (
            colegio_normalizado
            and colegio_normalizado in texto_normalizado
        ):
            coincidencias.append(colegio)

    if coincidencias:
        return max(coincidencias, key=len)

    return None


def detectar_genero(texto: str):
    texto_normalizado = normalizar_texto(texto)

    palabras_hombre = [
        "hombre",
        "varon",
        "masculino",
        "nino",
        "para nino",
        "para mi hijo"
    ]

    palabras_mujer = [
        "mujer",
        "femenino",
        "nina",
        "para nina",
        "para mi hija"
    ]

    if any(
        expresion in texto_normalizado
        for expresion in palabras_hombre
    ):
        return "Hombre"

    if any(
        expresion in texto_normalizado
        for expresion in palabras_mujer
    ):
        return "Mujer"

    return None


def detectar_talla(texto: str):
    texto_normalizado = normalizar_texto(texto)

    patrones = [
        r"\btalla\s*(xxl|xl|xs|s|m|l|\d{1,3})\b",
        r"\bnumero\s*(\d{1,3})\b",
        r"\b(xx|xxl|xl|xs)\b"
    ]

    for patron in patrones:
        coincidencias = re.findall(
            patron,
            texto_normalizado,
            flags=re.IGNORECASE
        )

        if coincidencias:
            return str(coincidencias[-1]).upper()

    # Detecta respuestas cortas como "38", "40" o "M"
    if re.fullmatch(
        r"(xxl|xl|xs|s|m|l|\d{1,3})",
        texto_normalizado,
        flags=re.IGNORECASE
    ):
        return texto_normalizado.upper()

    return None


def detectar_uniforme_completo(texto: str) -> bool:
    texto_normalizado = normalizar_texto(texto)

    expresiones = [
        "uniforme completo",
        "juego completo",
        "kit completo",
        "todo el uniforme",
        "uniforme entero",
        "conjunto completo"
    ]

    return any(
        expresion in texto_normalizado
        for expresion in expresiones
    )


def detectar_tipo_uniforme(texto: str):
    texto_normalizado = normalizar_texto(texto)

    deportivo = [
        "educacion fisica",
        "uniforme de educacion fisica",
        "uniforme educacion fisica",
        "uniforme deportivo",
        "ropa deportiva",
        "deportivo",
        "deportes",
        "calentador",
        "ef"
    ]

    diario = [
        "uniforme diario",
        "uniforme formal",
        "uniforme de diario",
        "uniforme normal",
        "diario",
        "formal"
    ]

    if any(
        expresion in texto_normalizado
        for expresion in deportivo
    ):
        return "Educación Física"

    if any(
        expresion in texto_normalizado
        for expresion in diario
    ):
        return "Uniforme Diario"

    return None


def detectar_prenda(texto: str):
    texto_normalizado = normalizar_texto(texto)

    # Primero detectamos conceptos compuestos
    tipo_uniforme = detectar_tipo_uniforme(texto)

    if tipo_uniforme:
        return tipo_uniforme

    prendas_comunes = {
        "chompa": "Chompa",
        "sueter": "Chompa",
        "sweater": "Chompa",
        "camisa": "Camisa",
        "camiseta": "Camiseta",
        "polo": "Polo",
        "pantalon": "Pantalón",
        "falda": "Falda",
        "buzo": "Buzo",
        "short": "Short",
        "pantaloneta": "Pantaloneta",
        "medias": "Medias",
        "corbata": "Corbata",
        "chaleco": "Chaleco",
        "mandil": "Mandil",
        "chaqueta": "Chaqueta",
        "casaca": "Chaqueta"
    }

    for palabra, nombre in prendas_comunes.items():
        if palabra in texto_normalizado:
            return nombre

    # Después revisamos nombres reales de la base
    coincidencias = []

    for prenda in obtener_prendas():
        prenda_normalizada = normalizar_texto(prenda)

        if (
            prenda_normalizada
            and prenda_normalizada in texto_normalizado
        ):
            coincidencias.append(prenda)

    if coincidencias:
        return max(coincidencias, key=len)

    return None


# ==========================================
# RESPUESTA DE DISPONIBILIDAD
# ==========================================
def filtrar_productos_exactos(
    productos,
    colegio=None,
    prenda=None,
    genero=None,
    talla=None
):
    """
    Conserva únicamente productos que coincidan exactamente
    con los datos solicitados por el cliente.
    """

    productos_exactos = []

    colegio_buscado = normalizar_texto(colegio)
    prenda_buscada = normalizar_texto(prenda)
    genero_buscado = normalizar_texto(genero)
    talla_buscada = normalizar_texto(talla)

    for producto in productos:
        colegio_producto = normalizar_texto(
            producto.get("colegio", "")
        )

        prenda_producto = normalizar_texto(
            producto.get("prenda", "")
        )

        genero_producto = normalizar_texto(
            producto.get("genero", "")
        )

        talla_producto = normalizar_texto(
            producto.get("talla", "")
        )

        coincide_colegio = (
            not colegio_buscado
            or colegio_buscado == colegio_producto
            or colegio_buscado in colegio_producto
            or colegio_producto in colegio_buscado
        )

        coincide_prenda = (
            not prenda_buscada
            or prenda_buscada == prenda_producto
            or prenda_buscada in prenda_producto
            or prenda_producto in prenda_buscada
        )

        # Una prenda "Unisex" sirve tanto para hombre como para mujer, así que
        # coincide con cualquier género que pida el cliente (la mayoría del
        # inventario es Unisex; sin esto casi nada calzaría con la consulta).
        coincide_genero = (
            not genero_buscado
            or genero_buscado == genero_producto
            or genero_producto == "unisex"
        )

        coincide_talla = (
            not talla_buscada
            or talla_buscada == talla_producto
        )

        stock = int(producto.get("stock") or 0)

        if (
            coincide_colegio
            and coincide_prenda
            and coincide_genero
            and coincide_talla
            and stock > 0
        ):
            productos_exactos.append(producto)

    return productos_exactos

def crear_respuesta_disponibilidad(productos):

    if productos:
        return (
            "✅ ¡Perfecto! Tenemos disponibilidad de la prenda solicitada. "
            "Para confirmar el precio actualizado y finalizar tu compra, "
            "comunícate con nuestro asesor de MegaUniformes por WhatsApp "
            "al 0991771729. ¡Será un gusto atenderte!"
        )

    return (
        "Gracias por tu consulta. 😊 "
        "Para confirmar la disponibilidad y conocer el precio actualizado, "
        "comunícate con nuestro asesor de MegaUniformes por WhatsApp "
        "al 0991771729. Él podrá ayudarte inmediatamente."
    )
    producto = disponibles[0]

    prenda = producto.get("prenda") or "producto"
    colegio = producto.get("colegio") or "la institución"
    talla = producto.get("talla") or "no especificada"
    genero = producto.get("genero") or "no especificado"
    stock = int(producto.get("stock") or 0)
    precio = float(producto.get("precio") or 0)

    respuesta = (
        f"Sí, encontré disponibilidad de {prenda} para {colegio}, "
        f"talla {talla}, para {genero}. "
        f"Actualmente aparecen {stock} unidades en inventario."
    )

    if precio > 0:
        respuesta += f" El precio registrado es de ${precio:.2f}."

    respuesta += (
        " Puedes consultar por WhatsApp para confirmar "
        "la disponibilidad antes de visitar el local."
    )

    return respuesta


# ==========================================
# RESPUESTA GENERAL CON IA
# ==========================================

def responder_con_ia(request: ChatRequest) -> str:
    prompt_sistema = """
Eres el asistente virtual oficial de MegaUniformes, una empresa de Cuenca
dedicada a la venta de uniformes escolares.

Responde en español, de forma amable, natural y breve.

Reglas importantes:
- Si el cliente saluda, responde el saludo.
- No inventes precios, stock, horarios, ubicación o formas de pago.
- La atención principal se realiza en el local físico.
- El chatbot puede orientar sobre colegios, prendas, tallas y disponibilidad.
- Informa claramente que utilizas inteligencia artificial cuando sea relevante.
- No prometas reservas, pagos o envíos automáticos.
- Mantén las respuestas entre una y cuatro oraciones.
"""

    mensajes = [
        {
            "role": "system",
            "content": prompt_sistema
        }
    ]

    if request.history:
        mensajes.extend(request.history[-10:])
    else:
        mensajes.append(
            {
                "role": "user",
                "content": request.message
            }
        )

    respuesta = client.chat.completions.create(
        model=MODEL,
        messages=mensajes,
        temperature=0.5,
        max_tokens=220
    )

    return respuesta.choices[0].message.content


# ==========================================
# ENDPOINTS
# ==========================================

@app.get("/")
def home():
    return {
        "mensaje": (
            "Backend MegaUniformes conectado "
            "con IA e inventario"
        )
    }


@app.get("/colegios")
def listar_colegios():
    try:
        colegios = obtener_colegios()

        colegios_limpios = sorted(
            {
                colegio.strip()
                for colegio in colegios
                if colegio and colegio.strip()
            }
        )

        return {
            "total": len(colegios_limpios),
            "colegios": colegios_limpios
        }

    except Exception as error:
        print("ERROR AL OBTENER COLEGIOS:", error)

        return {
            "total": 0,
            "colegios": []
        }
@app.post("/chat")
def chat(request: ChatRequest):
    try:
        mensaje_actual = request.message.strip()
        contexto = construir_contexto_usuario(request)

        # --------------------------------------
        # SALUDOS E INFORMACIÓN GENERAL
        # --------------------------------------

        if es_saludo_simple(mensaje_actual):
            return {
                "response": (
                    "¡Hola! 😊 Bienvenido a MegaUniformes. "
                    "Puedo ayudarte a consultar colegios, prendas, "
                    "tallas y disponibilidad. ¿Qué estás buscando?"
                ),
                "productos": []
            }

        if es_agradecimiento_o_despedida(mensaje_actual):
            return {
                "response": (
                    "¡Con gusto! 😊 Gracias por comunicarte con "
                    "MegaUniformes. Será un placer atenderte en el local."
                ),
                "productos": []
            }

        if es_consulta_horario(mensaje_actual):
            return {
                "response": (
                    "Todavía no tengo registrado el horario oficial. "
                    "Para confirmarlo, comunícate con un asesor de "
                    "MegaUniformes al 0991771729."
                ),
                "productos": []
            }

        if es_consulta_pago(mensaje_actual):
            return {
                "response": (
                    "Los métodos de pago deben confirmarse directamente "
                    "con un asesor de MegaUniformes al 0991771729."
                ),
                "productos": []
            }

        if es_consulta_ubicacion(mensaje_actual):
            return {
                "response": (
                    "MegaUniformes se encuentra en Cuenca. "
                    "Para conocer la dirección exacta, comunícate "
                    "al 0991771729."
                ),
                "productos": []
            }

        # --------------------------------------
        # EXTRAER TODO LO QUE YA DIJO EL CLIENTE
        # --------------------------------------

        colegio = detectar_colegio(contexto)
        prenda = detectar_prenda(contexto)
        genero = detectar_genero(contexto)

        talla = (
            detectar_talla(mensaje_actual)
            or detectar_talla(contexto)
        )

        uniforme_completo = detectar_uniforme_completo(contexto)
        tipo_uniforme = detectar_tipo_uniforme(contexto)

        # --------------------------------------
        # UNIFORME COMPLETO
        # --------------------------------------

        if uniforme_completo:
            if not colegio:
                return {
                    "response": (
                        "Claro, te ayudo a revisar un uniforme completo. "
                        "¿Para qué colegio o institución lo necesitas?"
                    ),
                    "productos": []
                }

            if not tipo_uniforme:
                return {
                    "response": (
                        f"Perfecto, uniforme completo para {colegio}. "
                        "¿Buscas el uniforme diario o el uniforme "
                        "de educación física?"
                    ),
                    "productos": []
                }

            if not genero:
                return {
                    "response": (
                        f"Entendido, uniforme completo de "
                        f"{tipo_uniforme.lower()} para {colegio}. "
                        "¿Es para hombre o para mujer?"
                    ),
                    "productos": []
                }

            if not talla:
                return {
                    "response": (
                        f"Perfecto, para {genero}. "
                        "¿Qué talla necesitas?"
                    ),
                    "productos": []
                }

            consulta = (
                f"{colegio} {tipo_uniforme} "
                f"{genero} {talla}"
            )

            productos_encontrados = buscar_productos(
                consulta,
                limite=30
            )

            productos_exactos = filtrar_productos_exactos(
                productos=productos_encontrados,
                colegio=colegio,
                prenda=tipo_uniforme,
                genero=genero,
                talla=talla
            )

            if productos_exactos:
                return {
                    "response": (
                        f"Sí encontré opciones del uniforme de "
                        f"{tipo_uniforme.lower()} para {colegio}, "
                        f"talla {talla}, para {genero}. "
                        "Debajo puedes revisar los productos disponibles. "
                        "Para confirmar las prendas incluidas y conocer "
                        "los precios exactos, comunícate con un asesor "
                        "de MegaUniformes al 0991771729."
                    ),
                    "productos": productos_exactos[:5]
                }

            return {
                "response": (
                    f"No encontré disponibilidad exacta del uniforme de "
                    f"{tipo_uniforme.lower()} para {colegio}, "
                    f"talla {talla}, para {genero}. "
                    "Para revisar otra talla o confirmar directamente "
                    "con un asesor, comunícate al 0991771729."
                ),
                "productos": []
            }

        # --------------------------------------
        # CONSULTA NORMAL DE UNA PRENDA
        # --------------------------------------

        if tiene_intencion_de_compra(contexto):
            if not colegio:
                return {
                    "response": (
                        "Claro, te ayudo a revisar la disponibilidad. "
                        "¿Para qué colegio o institución necesitas "
                        "el uniforme?"
                    ),
                    "productos": []
                }

            if not prenda:
                return {
                    "response": (
                        f"Perfecto, para {colegio}. "
                        "¿Qué prenda buscas? Puedes indicarme, por ejemplo, "
                        "chompa, camisa, pantalón, falda o "
                        "uniforme de educación física."
                    ),
                    "productos": []
                }

            if not genero:
                return {
                    "response": (
                        f"Entendido: {prenda} para {colegio}. "
                        "¿Es para hombre o para mujer?"
                    ),
                    "productos": []
                }

            if not talla:
                return {
                    "response": (
                        f"Perfecto, {prenda} para {genero}. "
                        "¿Qué talla necesitas?"
                    ),
                    "productos": []
                }

            consulta = (
                f"{colegio} {prenda} {genero} {talla}"
            )

            productos_encontrados = buscar_productos(
                consulta,
                limite=30
            )

            productos_exactos = filtrar_productos_exactos(
                productos=productos_encontrados,
                colegio=colegio,
                prenda=prenda,
                genero=genero,
                talla=talla
            )

            respuesta = crear_respuesta_disponibilidad(
                productos_exactos
            )

            return {
                "response": respuesta,
                "productos": productos_exactos[:5]
            }

        # --------------------------------------
        # CONVERSACIÓN GENERAL
        # --------------------------------------

        respuesta_ia = responder_con_ia(request)

        return {
            "response": respuesta_ia,
            "productos": []
        }

    except Exception as error:
        print("ERROR EN CHAT:", error)

        return {
            "response": (
                "Lo siento, ocurrió un problema al procesar "
                "tu consulta. Intenta nuevamente."
            ),
            "productos": []
        }