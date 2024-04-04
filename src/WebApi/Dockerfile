FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base

WORKDIR /app

EXPOSE 2777

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
ARG BUILD_CONFIGURATION=Development
WORKDIR /src

COPY ["WebApi/WebApi.csproj","WebApi/"]
COPY ["Util/Util.csproj","Util/"]
COPY ["BusinessLogic/BusinessLogic.csproj","BusinessLogic/"]
COPY ["DataAccessLayer/DataAccessLayer.csproj","DataAccessLayer/"]
COPY ["Model/Model.csproj","Model/"]
COPY ["Mocks/Mocks.csproj","Mocks/"]

RUN dotnet restore "WebApi/WebApi.csproj"

COPY  . .

WORKDIR "/src/WebApi"
RUN dotnet build "WebApi.csproj" -c $BUILD_CONFIGURATION -o //app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Development
RUN dotnet publish "WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p: UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "WebApi.dll"]
