#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["RetroTrack/RetroTrack/RetroTrack.Api.csproj", "RetroTrack/RetroTrack/"]
COPY ["RetroTrack.Domain/RetroTrack.Domain.csproj", "RetroTrack.Domain/"]
COPY ["RetroTrack.Infrastructure/RetroTrack.Infrastructure.csproj", "RetroTrack.Infrastructure/"]
RUN dotnet restore "./RetroTrack/RetroTrack/./RetroTrack.Api.csproj"
COPY . .
WORKDIR "/src/RetroTrack/RetroTrack"
RUN dotnet build "./RetroTrack.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./RetroTrack.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RetroTrack.Api.dll"]