# 1. Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
WORKDIR /src/src/Api

RUN dotnet publish Api.csproj -c Release -o /app/publish

# 2. Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

# Render виставляє PORT, його треба слухати
ENV ASPNETCORE_URLS=http://+:${PORT}

ENTRYPOINT ["dotnet", "Api.dll"]
