import subprocess
import threading
import webbrowser
import os
import sys
import platform
import mysql.connector

# Script para arrancar la app Next.js desde Python
# - Ejecuta `npm install` (una sola vez)
# - Ejecuta `npm run dev` y stream de la salida
# - Abre http://localhost:3000 en el navegador


def get_conn():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="MySql_8!Root#2026",
        database="agrolink_db",
    )

CWD = os.path.dirname(os.path.abspath(__file__))
URL = "http://localhost:3000"


def stream_output(proc):
    try:
        for line in proc.stdout:
            print(line, end="")
    except Exception:
        pass


def get_npm_cmd():
    # On Windows the npm executable is npm.cmd
    return "npm.cmd" if os.name == "nt" else "npm"


def run():
    # 1) Instalar dependencias (opcional si ya están)
    print("Ejecutando: npm install (si es necesario)...")
    npm_cmd = get_npm_cmd()
    try:
        install = subprocess.run([npm_cmd, "install"], cwd=CWD)
    except FileNotFoundError:
        print(f"No se encontró '{npm_cmd}' en PATH. Asegúrate de tener Node.js/npm instalados.")
        sys.exit(1)
    if install.returncode != 0:
        print("npm install falló. Revisa la salida y vuelve a intentarlo.")
        sys.exit(1)

    # 2) Arrancar servidor dev
    print("Arrancando: npm run dev...")
    try:
        proc = subprocess.Popen(
            [npm_cmd, "run", "dev"],
        cwd=CWD,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )
    except FileNotFoundError:
        print(f"No se encontró '{npm_cmd}' en PATH al intentar arrancar el servidor.")
        sys.exit(1)

    # Stream de salida en hilo
    t = threading.Thread(target=stream_output, args=(proc,), daemon=True)
    t.start()

    # 3) Abrir navegador
    print(f"Abriendo {URL} en el navegador...")
    webbrowser.open(URL)

    # Esperar hasta que termine o Ctrl+C
    try:
        proc.wait()
    except KeyboardInterrupt:
        print("Deteniendo servidor (terminando proceso)...")
        proc.terminate()
        proc.wait()


if __name__ == "__main__":
    run()
