#Login to docker ecr
aws ecr get-login-password --region eu-north-1 | sudo docker login --username AWS --password-stdin 956950626976.dkr.ecr.eu-north-1.amazonaws.com

#Build docker
sudo docker build -t dubts_backend .

#Tag docker image
sudo docker tag dubts_backend:latest 956950626976.dkr.ecr.eu-north-1.amazonaws.com/dubts_backend:latest

#Push docker image to ecr
sudo docker push 956950626976.dkr.ecr.eu-north-1.amazonaws.com/dubts_backend:latest