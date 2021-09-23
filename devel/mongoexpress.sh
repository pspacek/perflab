#!/bin/sh
# Ephemeral MongoDB Express instance - connecting to DB exposed by the devel container
docker run --rm --network=host -e ME_CONFIG_MONGODB_SERVER=localhost mongo-express
