FROM microsoft/dotnet:1.0.0-core
WORKDIR /app
ENV ASPNETCORE_URLS http://*:50759
EXPOSE 50759
ENTRYPOINT ["dotnet", "node-log-admin.dll"]
COPY . /app
