FROM python:3.7.5-slim-stretch

# Create app directory
WORKDIR /opt/panic_oasis

# Copy everything from host into the container except the ignored files
COPY ./ ./

RUN pip install pipenv
RUN pipenv sync

CMD [ "pipenv", "run", "python", "run_alerter.py" ]
