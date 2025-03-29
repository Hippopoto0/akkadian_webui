FROM python:3.9-slim-buster
# FROM huggingface/transformers-pytorch-cpu

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

WORKDIR /app

COPY requirements.txt .

# RUN pip install uv --no-cache-dir && \
#     uv pip install --system -r requirements.txt
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001", "--reload", "--reload-dir", "/app"]

EXPOSE 3001