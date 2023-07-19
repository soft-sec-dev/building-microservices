## Chap-3
- `docker login <register-name> --username <...> --password <...>`
- `docker tag video-streaming bmdksergio1.azurecr.io/video-streaming:latest`
- `docker push bmdksergio1.azurecr.io/video-streaming`
- `docker rmi id --force` *to delete force containers running*
- `docker run -dp 3000:3000 bmdksergio1.azurecr.io/video-streaming:latest`

## Chap-4
- `docker-compose down && docker-compose up --build` *Restart automatically*

## Chap-5
- RabbitMq vs Http
- Indirect vs direct message

## Chap-5.1
- Http -> direct messaje using `http.request - Post`