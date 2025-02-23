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
            server_name raspub 192.168.1.102;
            root /home/enruxer/projects/front-survey-hub/dist;
            index index.html;
    
            location / {
                    try_files $uri $uri/ /index.html;
            }
    
            error_page 404 /index.html;
    
            location /api {
                    proxy_pass http://localhost:8080/api;
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
# Nginx Setup

```bash
sudo nginx -t
sudo systemctl status nginx.service
sudo journalctl -xeu nginx.service
sudo setfacl -m g:www-data:rwx dist
sudo chown -R www-data:www-data dist
sudo ln -sf /etc/nginx/sites-available/front-survey-hub-nginx-conf /etc/nginx/sites-enabled/front-survey-hub-nginx-symln
```

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
- search service (elastic search)

# Docker 
- sudo docker build . -t amdocker100/survey-hub-frontend:1.0
- sudo docker login -u amdocker100
- sudo docker push amdocker100/survey-hub-frontend:1.0
- 