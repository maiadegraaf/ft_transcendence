#!/bin/bash

# Bash script for curl GET - POST - PUT - DELETE request to the DB
# Run the script with the -m flag followed by GET/POST/PUT/DELETE
# Get:
#   - without arguments -> shows all the users
#   - with -i <user_id> -> specific user
# DELETE:
#   - with -i <user_id> to indicate wich user to delete (if it user doesn't exists, nothing happens)
# POST:
#   - with -l <login> -e <email> to set the values for login and email
# PUT:
#   - with -i <user_id> to indicate wich user to update
#   - with either one or both of the -e -l flags

METHOD=""
LOGIN=""
EMAIL=""
USER_ID=""

while getopts ":m:l:e:i:" opt; do
  case $opt in
    m) METHOD="$OPTARG"
    ;;
    l) LOGIN="$OPTARG"
    ;;
    e) EMAIL="$OPTARG"
    ;;
    i) USER_ID="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

if [ "$METHOD" = "" ]; then
  echo "Please specify the HTTP method with the -m flag (e.g. -m GET)"
  exit 1
fi

if [ "$METHOD" = "POST" ] && [ "$LOGIN" = "" ]; then
  echo "Please specify a login value with the -l flag (e.g. -l JanJ)"
  exit 1
fi

if [ "$METHOD" = "POST" ] && [ "$EMAIL" = "" ]; then
  echo "Please specify an email value with the -e flag (e.g. -e test@gmail.com)"
  exit 1
fi

if [ "$METHOD" = "GET" ] && [ "$USER_ID" = "" ]; then
  curl -X GET http://localhost:8080/api/users
elif [ "$METHOD" = "GET" ] && [ "$USER_ID" != "" ]; then
  curl -X GET http://localhost:8080/api/user/$USER_ID
elif [ "$METHOD" != "GET" ] && [ "$METHOD" != "POST" ]  && [ "$USER_ID" = "" ]; then
  echo "Please specify a user ID with the -i flag (e.g. -i 2)"
  exit 1
else
  if [ "$METHOD" = "POST" ]; then
    curl -X "$METHOD" http://localhost:8080/api/users -H "Content-Type: application/json" -d "{\"login\":\"$LOGIN\",\"email\":\"$EMAIL\"}"
  elif [ "$METHOD" = "DELETE" ]; then
    curl -X "$METHOD" http://localhost:8080/api/user/$USER_ID
  else
    JSON_BODY="{"
    if [ "$LOGIN" != "" ]; then
      JSON_BODY="$JSON_BODY \"login\":\"$LOGIN\""
    fi
    if [ "$EMAIL" != "" ]; then
      if [ "$LOGIN" != "" ]; then
        JSON_BODY="$JSON_BODY,"
      fi
      JSON_BODY="$JSON_BODY \"email\":\"$EMAIL\""
    fi
    JSON_BODY="$JSON_BODY }"
    curl -X "$METHOD" http://localhost:8080/api/user/$USER_ID -H "Content-Type: application/json" -d "$JSON_BODY"
  fi
fi
