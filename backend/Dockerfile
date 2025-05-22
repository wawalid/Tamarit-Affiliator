# Usa la imagen base de Node
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del backend al contenedor
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto del backend (ajústalo si usas otro)
EXPOSE 5000

# Comando para iniciar el backend (CAMBIAMOS esto)
CMD ["node", "src/index.js"]
