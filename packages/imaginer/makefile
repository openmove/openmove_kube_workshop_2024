start:
	python3 ./main.py

generate-env-file:
	conda env export > ./envs/environment.yml
generate-requirements:
	pip freeze > ./envs/requirements.txt
prepare-env:
	- make generate-env-file
	- make generate-requirements
