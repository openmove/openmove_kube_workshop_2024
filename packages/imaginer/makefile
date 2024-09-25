start:
	python3 ./main.py

generate-env-file:
	conda env export --from-history > ./envs/environment.yml
generate-requirements:
	pip freeze > ./envs/requirements.txt
prepare-env:
	- make generate-env-file
	- make generate-requirements

build:
	docker build -t imaginer .
build-arm:
	docker build -t imaginer -f ./Dockerfile.arm .
