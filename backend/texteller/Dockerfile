FROM python:3.12-slim-bookworm

# prevents .pyc
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN pip install uv
RUN uv pip install texteller --system

# COPY . .

EXPOSE 8000

CMD [ "texteller", "launch", "--ngpu-per-replica", "0", "--use-onnx", "--ncpu-per-replica", "3" ]