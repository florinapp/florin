FROM python:2.7-alpine
RUN mkdir /app
COPY ["florin", "/app"]
COPY ["requirements.txt", "requirements-dev.txt", "/app/"]
COPY ["tasks.py", "/app"]
COPY ["wsgi.py", "/app"]
WORKDIR /app
RUN pip install -r requirements-dev.txt
RUN inv run
