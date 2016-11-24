FROM microsoft/dotnet:1.0.0-preview2-onbuild

WORKDIR /app
ENV ASPNETCORE_URLS http://*:50759

ENV NLE_URL ${NLE_URL}
ENV NLE_PORT ${NLE_PORT}
ENV NLE_PROTOCOL ${NLE_PROTOCOL}
ENV NLE_KEY ${NLE_KEY}

EXPOSE 50759
ENTRYPOINT ["dotnet", "run"]
COPY . /app
RUN dotnet restore
RUN dotnet build
