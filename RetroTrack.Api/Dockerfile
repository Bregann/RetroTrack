# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files and restore as distinct layers
COPY ["RetroTrack.Api/RetroTrack.Api.csproj", "RetroTrack.Api/"]
COPY ["RetroTrack.Domain/RetroTrack.Domain.csproj", "RetroTrack.Domain/"]
RUN dotnet restore "RetroTrack.Api/RetroTrack.Api.csproj"

# Copy everything else
COPY . .
WORKDIR "/src/RetroTrack.Api"
RUN dotnet build "RetroTrack.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "RetroTrack.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RetroTrack.Api.dll"]
