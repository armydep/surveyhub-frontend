# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

react + vite + nginx

npm install react-router-dom

mock backend json:
 npm install -g json-server

build:
npm run build

run:
npm run dev

# Nginx config:
-------
`

    server {
      listen 80;  
      server_name raspub 192.168.1.102;                                                                                                                                                                                                               root /home/enruxer/gen-frontend/dist;              
      index index.html;
  
      location / {
              try_files $uri $uri/ /index.html;
      }
  
      error_page 404 /index.html;
  
      location /api {
          proxy_pass http://localhost:8080/api;
          #add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
          #add_header Access-Control-Allow-Headers "Authorization, Content-Type";
          #add_header Access-Control-Allow-Origin *;
          #if ($request_method = OPTIONS) {
                  #add_header Allow "POST, OPTIONS, PUT, DELETE, GET";
              #add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
              #add_header Access-Control-Allow-Origin "*";
              #return 200;
              #   }
      }
  
      location /ws/api {
          proxy_pass http://localhost:8080/ws/api;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "Upgrade";
          proxy_set_header Host $host;
      }
   }  

`
------
# Pages:
- home 
- dashboard
- surveys
  - all
  - top N by rating
- users
- statistics
  - total numbers: surveys, answers, users
  - survey answers grouping:
- survey answers
- single answer