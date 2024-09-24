start:
	python3 ./main.py

generate-env-file:
	conda env export > environment.yml
generate-requirements:
	pip freeze > requirements.txt
prepare-env:
	- make generate-env-file
	- make generate-requirements
