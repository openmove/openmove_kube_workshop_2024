# Define variables for paths and commands
MICROK8S_INSTALL_DIR = cluster/scripts/microk8s
NAMESPACE_DIR = cluster/ns
K8S_SECRET_DIR = cluster/k
RABBITMQ_SPEC_DIR = cluster/specs/rabbit
MONGO_ARM_SPEC_DIR = cluster/specs/mongo-arm
MONGO_SPEC_DIR = cluster/specs/mongo
API_SPEC_DIR = cluster/specs/api
WWW_SPEC_DIR = cluster/specs/www
IMAGINER_SPEC_DIR = cluster/specs/imaginer
PORT_FORWARD_DIR = cluster/_scripts/port-forward

# Default target
.PHONY: all
all: install-namespaces apply-secrets apply-specs port-forward

# Install MicroK8s
.PHONY: install
install:
	cd $(MICROK8S_INSTALL_DIR) && chmod +x install.sh && ./install.sh

# Create namespaces
.PHONY: create-namespaces
create-namespaces:
	cd $(NAMESPACE_DIR) && microk8s kubectl apply -f mongodb.yaml
	cd $(NAMESPACE_DIR) && microk8s kubectl apply -f rabbitmq.yaml
	cd $(NAMESPACE_DIR) && microk8s kubectl apply -f system.yaml

# Apply Kubernetes secrets
.PHONY: apply-secrets
apply-secrets:
	cd $(K8S_SECRET_DIR) && microk8s kubectl apply -k mongo
	cd $(K8S_SECRET_DIR) && microk8s kubectl apply -k rabbit
	cd $(K8S_SECRET_DIR) && microk8s kubectl apply -k api
	cd $(K8S_SECRET_DIR) && microk8s kubectl apply -k www
	cd $(K8S_SECRET_DIR) && microk8s kubectl apply -k imaginer

# Apply specifications for RabbitMQ and MongoDB
.PHONY: apply-specs
apply-specs:
	cd $(RABBITMQ_SPEC_DIR) && microk8s kubectl apply -f rabbitmq.yaml
	cd $(MONGO_ARM_SPEC_DIR) && microk8s kubectl apply -f mongodb-arm.yaml
	cd $(MONGO_SPEC_DIR) && microk8s kubectl apply -f mongodb.yaml
	cd $(API_SPEC_DIR) && microk8s kubectl apply -f api.yaml
	cd $(WWW_SPEC_DIR) && microk8s kubectl apply -f www.yaml
	cd $(IMAGINER_SPEC_DIR) && microk8s kubectl apply -f imaginer.yaml

# Port forward
.PHONY: port-forward
port-forward:
	cd $(PORT_FORWARD_DIR) && ./forward.sh

# Target to run everything
.PHONY: all
all: install create-namespaces apply-secrets apply-specs port-forward
