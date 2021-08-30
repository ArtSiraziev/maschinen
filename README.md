# maschinen

To start project locally insert command:
 
 docker-compose -f ./docker-compose.yml up --build


Frontend could be launched at http://localhost 

CouchDB Interface could be opened at http://localhost:5984/_utils/ login: admin, password: admin

Note:
It is important to compose from the folder "Maschinen", cause database name depends on folder name

- nginx.config are laying at ./frontend/nginx.config folder
- couchdb folder consist of ini file, which sets configuration for database
- also d3Service and everything with d3 is better to use as separate functions (but did not have time to correct this)
