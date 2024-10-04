# Requirements

MacOS only: Install Homebrew [Link](brew).

Install microk8s with the following command:

```
cd cluster/scripts/microk8s
chmod +x install.sh
./install.sh
```

# Workshop

### Create namespace
```
cd cluster/ns
microk8s kubectl apply -f mongodb.yaml
microk8s kubectl apply -f rabbitmq.yaml
microk8s kubectl apply -f system.yaml #house of all applications
```

### Apply k8s secrets 
```
cd cluster/k
microk8s kubectl apply -k mongo
microk8s kubectl apply -k rabbit
microk8s kubectl apply -k api
microk8s kubectl apply -k www
microk8s kubectl apply -k imaginer
```

## Apply k8s specs

### RabbitMQ
```
cd cluster/specs/rabbit
microk8s kubectl apply -f rabbitmq.yaml
```

### MONGO For ARM pc
```
cd cluster/specs/mongo-arm
microk8s kubectl apply -f mongodb-arm.yaml
```

### MONGO For other pc
```
cd cluster/specs/mongo
microk8s kubectl apply -f mongodb.yaml
```

### Apply API
```
cd cluster/specs/api
microk8s kubectl apply -f api.yaml
```

### Apply WWW
```
cd cluster/specs/www
microk8s kubectl apply -f www.yaml
```

### Apply imaginer
```
cd cluster/specs/imaginer
microk8s kubectl apply -f imaginer.yaml
```

### Port forward

In a terminal run:
``` 
microk8s kubectl port-forward svc/www-service 8080:80 -n system
```

In another terminal run:
```
microk8s kubectl port-forward svc/api-service 8081:3001 -n system
```
