FROM continuumio/miniconda3
WORKDIR /app
COPY environment_x86.yml /app/environment_x86.yml
RUN conda update -n base -c defaults conda && \
    conda env create -f environment_x86.yml
RUN echo "conda activate imaginer" >> ~/.bashrc
SHELL ["/bin/bash", "--login", "-c"]
ENV PATH /opt/conda/envs/imaginer/bin:$PATH
COPY . .
ADD main.py main.py
CMD ["python3", "main.py"]
