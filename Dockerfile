FROM node:22

WORKDIR /app

COPY package*.json ./
COPY frontend ./frontend
COPY backend ./backend

EXPOSE 3000
EXPOSE 5500

CMD ["npm", "run", "reels"]