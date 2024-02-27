FROM node:lts-slim

ENV APP_ID_NUMBER=193
ENV APP_ID_NAME=mpsadm
ENV GROUP_ID_NUMBER=199
ENV GROUP_ID_NAME=appadmin

RUN apt update -y && \
  apt install -y curl git openssl

RUN deluser --remove-home node && \
  DEBIAN_FRONTEND=non-interactive && \
  groupadd -g ${GROUP_ID_NUMBER} ${GROUP_ID_NAME} && \
  useradd -l -s /bin/bash -m -u ${APP_ID_NUMBER} -g ${GROUP_ID_NAME} ${APP_ID_NAME} && \
  chown -R ${APP_ID_NAME}:${GROUP_ID_NAME} /home/${APP_ID_NAME}

# Guarantees umask is set properly to alleviate issue with umask not sticking inside the node container
# This is to ensure permissions of files stored on the server will be given the correct permissions
# This is required for node apps that write files out to the host filesystem
RUN echo 'umask 002' >> /home/${APP_ID_NAME}/.profile && \
  echo 'umask 002' >> /home/${APP_ID_NAME}/.bashrc

WORKDIR /home/${APP_ID_NAME}
COPY . /home/${APP_ID_NAME}

RUN npm install && \
    chown -R 193:199 "/home/mpsadm/.npm"

USER ${APP_ID_NAME}

CMD [ "npm", "start" ]
