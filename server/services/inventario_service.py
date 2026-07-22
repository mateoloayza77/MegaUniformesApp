import sqlite3
import unicodedata
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "inventario.db"

PALABRAS_IGNORADAS = {
    "hola", "buenas", "buenos", "dias", "tardes", "noches",
    "quiero", "quisiera", "necesito", "busco", "tienen", "tiene",
    "hay", "disponible", "disponibilidad", "uniforme", "uniformes",
    "del", "de", "la", "el", "los", "las", "para", "un", "una",
    "me", "puede", "puedes", "tal", "vez", "por", "favor"
}


def normalizar_texto(texto):
    if texto is None:
        return ""

    texto = str(texto).lower().strip()
    texto = unicodedata.normalize("NFD", texto)

    return "".join(
        caracter
        for caracter in texto
        if unicodedata.category(caracter) != "Mn"
    )


def obtener_valores_unicos(columna):
    if not DB_PATH.exists():
        return []

    columnas_permitidas = {
        "colegio",
        "prenda",
        "genero",
        "talla"
    }

    if columna not in columnas_permitidas:
        return []

    conexion = sqlite3.connect(DB_PATH)
    cursor = conexion.cursor()

    cursor.execute(
        f"""
        SELECT DISTINCT {columna}
        FROM inventario
        WHERE {columna} IS NOT NULL
        AND TRIM({columna}) != ''
        """
    )

    valores = [
        str(fila[0]).strip()
        for fila in cursor.fetchall()
        if fila[0] is not None
    ]

    conexion.close()

    return valores


def obtener_colegios():
    return obtener_valores_unicos("colegio")


def obtener_prendas():
    return obtener_valores_unicos("prenda")


def obtener_tallas():
    return obtener_valores_unicos("talla")


def obtener_palabras_busqueda(texto):
    texto_normalizado = normalizar_texto(texto)

    palabras = [
        palabra.strip(".,;:¿?¡!()[]{}")
        for palabra in texto_normalizado.split()
    ]

    return [
        palabra
        for palabra in palabras
        if palabra
        and palabra not in PALABRAS_IGNORADAS
        and len(palabra) >= 2
    ]


def buscar_productos(texto, limite=8):
    palabras = obtener_palabras_busqueda(texto)

    if not palabras or not DB_PATH.exists():
        return []

    conexion = sqlite3.connect(DB_PATH)
    conexion.row_factory = sqlite3.Row
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            id,
            colegio,
            prenda,
            genero,
            talla,
            stock,
            precio,
            descripcion_original
        FROM inventario
    """)

    registros = cursor.fetchall()
    conexion.close()

    resultados = []

    for registro in registros:
        producto = dict(registro)

        texto_producto = normalizar_texto(
            f"{producto.get('colegio', '')} "
            f"{producto.get('prenda', '')} "
            f"{producto.get('genero', '')} "
            f"{producto.get('talla', '')} "
            f"{producto.get('descripcion_original', '')}"
        )

        coincidencias = sum(
            1
            for palabra in palabras
            if palabra in texto_producto
        )

        if coincidencias > 0:
            producto["_puntaje"] = coincidencias
            resultados.append(producto)

    resultados.sort(
        key=lambda producto: (
            producto.get("_puntaje", 0),
            producto.get("stock", 0) or 0
        ),
        reverse=True
    )

    resultados_finales = []

    for producto in resultados[:limite]:
        producto.pop("_puntaje", None)
        resultados_finales.append(producto)

    return resultados_finales