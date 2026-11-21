FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CLOUD_RUN_REGION=us-central1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY build_artifacts.py main.py ./
RUN python build_artifacts.py

EXPOSE 8080
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
