FROM continuumio/miniconda3
WORKDIR /app
COPY . .
# COPY environment_x86.yml .
RUN conda env create -f environment_x86.yml
SHELL ["conda", "run", "-n", "imaginer", "/bin/bash", "-c"]
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "imaginer", "python", "main.py"]