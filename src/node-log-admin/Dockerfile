FROM microsoft/dotnet:1.0.0-preview2-sdk
WORKDIR /app
ENV ASPNETCORE_URLS http://*:50759
ENV NLE_URL http://nle:3000

EXPOSE 50759
ENTRYPOINT ["dotnet", "run"]
COPY . /app
RUN dotnet restore
RUN dotnet build
