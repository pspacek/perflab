# Hacks for development

Dockerfile.devel in the top directory allows to run Perflab web interface
& Perflab agent & build BIND in the same container on the a single machine.

THIS IS INTENDED ONLY FOR DEVELOPMENT.

Usage:

1. Build new Perflab container from the current source tree
   (includes a preconfigured MongoDB image):
```
docker-compose build
```

2. Start MongoDB container + Perflab web interface & agent
   (all-in-one inside a single Perflab container, does not use SSH):
```
docker-compose up
```

3. (Optional) Run MongoDB Express web interface:
```
sh mongoexpress.sh
```

4. Rebuild and restart as needed. Database is persisted in the MongoDB container:
```
docker-compose stop
docker-compose build
docker-compose start
```

5. Remove all containers including the database:
```
docker-compose down
```
