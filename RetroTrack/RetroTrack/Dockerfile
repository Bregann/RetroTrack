#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["RetroTrack/RetroTrack/RetroTrack.Api.csproj", "RetroTrack/RetroTrack/"]
COPY ["RetroTrack.Domain/RetroTrack.Domain.csproj", "RetroTrack.Domain/"]
COPY ["RetroTrack.Infrastructure/RetroTrack.Infrastructure.csproj", "RetroTrack.Infrastructure/"]
RUN dotnet restore "RetroTrack/RetroTrack/RetroTrack.Api.csproj"
COPY . .
WORKDIR "/src/RetroTrack/RetroTrack"
RUN dotnet build "RetroTrack.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RetroTrack.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RetroTrack.Api.dll"]