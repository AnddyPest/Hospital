# Usar una imagen oficial de Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto (ajusta si tu app usa otro)
EXPOSE 3030

# Comando para iniciar la app
CMD ["npm", "start"]
