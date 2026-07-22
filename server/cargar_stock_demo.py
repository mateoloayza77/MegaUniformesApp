"""
Carga stock y precios de DEMO en inventario.db.

El inventario importado del Excel trae stock=0 y precio=0 en todas las filas
(ver README). Con eso el asistente nunca puede confirmar disponibilidad ni
mostrar productos, así que las "entities" (colegio/prenda/género/talla) quedan
invisibles en la demostración.

Este script asigna, de forma reproducible (semilla fija), un stock realista a
cada prenda y un precio referencial por tipo de prenda. Así el chatbot devuelve
fichas de producto reales cuando el cliente pregunta. El precio no se cotiza en
el chat (el negocio confirma precio por WhatsApp); se guarda solo para que el
inventario luzca completo.

Uso:
    cd server
    python cargar_stock_demo.py

Después: `git add server/inventario.db && git commit && git push` para que Render
redespliegue con el inventario actualizado.
"""

import random
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "inventario.db"

# Semilla fija → resultado reproducible (el mismo inventario en cada corrida).
random.seed(2026)

# Precio referencial (USD) por tipo de prenda, según su nombre normalizado.
# Se elige por coincidencia de palabra clave; si no coincide, usa RANGO_DEFECTO.
PRECIOS = [
    (("conjunto deportivo", "calentador"), (35, 48)),
    (("buzo", "chompa", "casaca", "saco", "abrigo"), (28, 42)),
    (("pantalon casimir", "pantalon plomo", "pantalon"), (22, 32)),
    (("falda", "vestido", "pollera"), (20, 30)),
    (("pantalon deportivo", "licra", "pantaloneta", "bermuda"), (15, 25)),
    (("blusa", "camisa"), (15, 22)),
    (("camiseta polo", "polo", "camiseta", "polin", "camiseta cc ff"), (12, 18)),
    (("mandil", "bata"), (14, 22)),
    (("corbata", "gorro", "medias", "panacho", "cinturon"), (6, 14)),
]
RANGO_DEFECTO = (15, 25)


def precio_para(prenda: str) -> float:
    p = (prenda or "").strip().lower()
    for claves, (lo, hi) in PRECIOS:
        if any(clave in p for clave in claves):
            return round(random.uniform(lo, hi) * 2) / 2  # a .00 / .50
    lo, hi = RANGO_DEFECTO
    return round(random.uniform(lo, hi) * 2) / 2


def main() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"No se encontró la base: {DB_PATH}")

    conexion = sqlite3.connect(DB_PATH)
    cursor = conexion.cursor()

    filas = cursor.execute("SELECT id, prenda FROM inventario").fetchall()

    actualizadas = 0
    for id_, prenda in filas:
        # Stock 6-30: rango seguro para la demo (nada queda "agotado" por azar),
        # pero variado para que se vea como inventario real.
        stock = random.randint(6, 30)
        precio = precio_para(prenda)
        cursor.execute(
            "UPDATE inventario SET stock = ?, precio = ? WHERE id = ?",
            (stock, precio, id_),
        )
        actualizadas += 1

    conexion.commit()

    total = cursor.execute("SELECT COUNT(*) FROM inventario").fetchone()[0]
    con_stock = cursor.execute(
        "SELECT COUNT(*) FROM inventario WHERE stock > 0"
    ).fetchone()[0]
    conexion.close()

    print(f"Filas actualizadas: {actualizadas}")
    print(f"Total en inventario: {total} · con stock>0: {con_stock}")


if __name__ == "__main__":
    main()
