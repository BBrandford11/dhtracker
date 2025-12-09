#!/bin/bash
# Fix for Netskope certificate warning
unset NODE_EXTRA_CA_CERTS
unset SSL_CERT_FILE
exec npm start




